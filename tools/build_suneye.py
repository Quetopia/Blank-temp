"""Quetopia Suneye: first reference-based companion sculpt study, not final game art.
Source: https://www.tiktok.com/@quetopia3/video/7682590908499447071
Run Blender --background --python build_suneye.py -- OUTPUT_DIRECTORY
Creates editable .blend, animated GLB and a lit review render. No existing assets touched.
"""
import bpy, math, random, sys, json
from pathlib import Path
from mathutils import Vector
random.seed(17)
OUT = Path(sys.argv[sys.argv.index('--')+1])
OUT.mkdir(parents=True, exist_ok=True)
bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
def mat(name, color, metal=.25, rough=.3, glow=0):
    m=bpy.data.materials.new(name); m.diffuse_color=(*color,1); m.use_nodes=True
    p=m.node_tree.nodes.get('Principled BSDF'); p.inputs['Base Color'].default_value=(*color,1)
    p.inputs['Metallic'].default_value=metal; p.inputs['Roughness'].default_value=rough
    p.inputs['Emission Color'].default_value=(*color,1); p.inputs['Emission Strength'].default_value=glow
    return m
gold=mat('Antique rose gold',(.46,.18,.065),.82,.26)
pink=mat('Living copper eyelids',(.37,.035,.105),.55,.32)
white=mat('Warm opal sclera',(.63,.32,.25),.15,.22)
black=mat('Deep glossy pupil',(.003,.002,.009),.22,.12)
iris=mat('Amber iris',(.8,.27,.018),.55,.24,.13)
teal=mat('Verdigris leaf',(.018,.31,.23),.55,.32)
colors=[mat(n,c,.48,.28,.1) for n,c in [('Saffron',(.95,.37,.028)),('Fuchsia',(.64,.025,.24)),('Peacock',(.015,.53,.38)),('Violet',(.24,.035,.57)),('Ivory gold',(.95,.7,.2))]]
parts=[]
def mesh(name,v,f,m):
    data=bpy.data.meshes.new(name); data.from_pydata(v,[],f); data.update()
    o=bpy.data.objects.new(name,data); bpy.context.collection.objects.link(o); o.data.materials.append(m)
    for p in data.polygons:p.use_smooth=True
    parts.append(o); return o
def orb(name,loc,scale,m,seg=24,rings=12):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=seg,ring_count=rings,location=loc)
    o=bpy.context.object; o.name=name; o.scale=scale; o.data.materials.append(m)
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    for p in o.data.polygons:p.use_smooth=True
    parts.append(o); return o
def tube(name,pts,r,m):
    c=bpy.data.curves.new(name,'CURVE'); c.dimensions='3D'; c.resolution_u=2; c.bevel_depth=r; c.bevel_resolution=2
    s=c.splines.new('POLY'); s.points.add(len(pts)-1)
    for p,co in zip(s.points,pts):p.co=(*co,1)
    o=bpy.data.objects.new(name,c); bpy.context.collection.objects.link(o); o.data.materials.append(m); parts.append(o); return o
Z=1.65
orb('Seedpod back',(0,.14,Z),(.49,.24,.49),gold,48,24)
orb('Eye globe',(0,-.04,Z),(.41,.19,.255),white,48,24)
orb('Iris',(0,-.214,Z),(.228,.065,.237),iris,64,24)
orb('Pupil',(0,-.267,Z),(.123,.025,.178),black,48,24)
for i in range(96):
    a=2*math.pi*i/96; r0=.131+random.random()*.022; r1=.215
    tube('Iris radial fiber %02d'%i,[(r*math.cos(a),-.276+.04*((r-.13)/.09),Z+r*math.sin(a)) for r in [r0,(r0+r1)/2,r1]],.0019,colors[i%5])
for sign in [-1,1]:
    pts=[(.43*math.cos(t),-.188,Z+sign*.268*math.sin(t)**.8) for t in [math.pi*j/64 for j in range(65)]]
    tube('Sculpted eyelid',pts,.029,pink)
    tube('Gold eyelid piping',[(x,y-.021,z+sign*.027) for x,y,z in pts],.008,gold)
for ring in range(3):
    for i in range(48):
        a=2*math.pi*(i+.5*(ring%2))/48; r=.455+ring*.028
        o=orb('Overlapping seed scale',(r*math.cos(a),-.075+ring*.03,Z+r*math.sin(a)),(.024,.034,.04),gold,12,8); o.rotation_euler[1]=-a
petals=[]
for layer,count in [(0,32),(1,24)]:
    for i in range(count):
        a=2*math.pi*(i+.35*layer)/count; length=(.66 if layer else .89)*(1+.1*math.sin(i*2.3))
        verts=[]; faces=[]; center=[]
        for j in range(33):
            t=j/32; r=.47+length*t; bend=.072*math.sin(t*9+i*.7)*t
            x=r*math.cos(a)+bend*-math.sin(a); z=Z+r*math.sin(a)+bend*math.cos(a)
            y=.055+layer*.065+.10*math.sin(t*math.pi)-.12*t*t
            width=(.044 if layer else .051)*math.sin(math.pi*t)**.65+.002
            center.append((x,y-.017,z))
            for k in range(7):
                u=(k/6*2-1); verts.append((x+width*u*-math.sin(a),y+.036*u*u*math.sin(math.pi*t),z+width*u*math.cos(a)))
        for j in range(32):
            for k in range(6):
                q=j*7+k; faces.append((q,q+1,q+8,q+7))
        p=mesh('Ribbon petal %d %02d'%(layer,i),verts,faces,colors[i%5]); petals.append(p)
        solid=p.modifiers.new('Petal thickness','SOLIDIFY'); solid.thickness=.005
        tube('Petal midrib',center,.006,gold)
        for sign in [-1,1]:
            tube('Chromatic petal edge',[(verts[j*7+(0 if sign<0 else 6)][0],verts[j*7+(0 if sign<0 else 6)][1]-.006,verts[j*7+(0 if sign<0 else 6)][2]) for j in range(33)],.004,colors[(i+2)%5])
for i in range(9):
    x=(i-4)*.063; pts=[]
    for j in range(49):
        t=j/48; pts.append((x+.08*math.sin(t*8+i)*t,.16+.07*math.cos(t*7+i),Z-.35-1.0*t))
    tube('Trailing living root %02d'%i,pts,.012 if i%2 else .02,colors[i%5])
for i in range(6):
    side=-1 if i%2 else 1; z0=.52+(i//2)*.22; verts=[]; faces=[]
    for j in range(25):
        t=j/24; x=side*(.06+.38*t); z=z0-.30*t+.10*math.sin(t*math.pi)
        width=.095*math.sin(t*math.pi)
        for k in range(5):
            u=k/2-1; verts.append((x,.04+.035*u*u,z+width*u))
    for j in range(24):
        for k in range(4):
            q=j*5+k; faces.append((q,q+1,q+6,q+5))
    mesh('Pendant leaf',verts,faces,teal)
    tube('Leaf gold spine',[verts[j*5+2] for j in range(25)],.007,gold)
    for j in range(4,22,3):
        for edge in [0,4]:tube('Leaf veins',[verts[(j-2)*5+2],verts[j*5+edge]],.003,colors[(i+1)%5])
# Simple articulated root: detailed mesh is a study; deformation retopology comes later.
bpy.ops.object.armature_add(location=(0,0,0)); rig=bpy.context.object; rig.name='Suneye_Rig'
rig.data.bones[0].name='hover_root'
for o in parts:o.parent=rig
for frame,z,angle in [(1,0,-.035),(31,.055,.035),(61,0,-.035)]:
    rig.location.z=z; rig.rotation_euler[1]=angle; rig.keyframe_insert(data_path='location',frame=frame); rig.keyframe_insert(data_path='rotation_euler',frame=frame)
bpy.context.scene.frame_end=60; bpy.context.scene.render.fps=30; bpy.context.scene.frame_set(1)
rig['reference_url']='https://www.tiktok.com/@quetopia3/video/7682590908499447071'
rig['status']='First sculpt study. Hover only; petal deformation, baked textures and game LOD pending.'
# Convert curve details so the game export includes the same visible ornament.
for o in parts:
    if o.type=='CURVE':
        bpy.ops.object.select_all(action='DESELECT'); o.select_set(True); bpy.context.view_layer.objects.active=o
        bpy.ops.object.convert(target='MESH')
bpy.ops.object.select_all(action='DESELECT')
for o in parts:o.select_set(True)
rig.select_set(True); bpy.context.view_layer.objects.active=rig
bpy.ops.export_scene.gltf(filepath=str(OUT/'Suneye-study.glb'),export_format='GLB',use_selection=True,export_apply=True,export_animations=True)
scene=bpy.context.scene; scene.render.engine='CYCLES'; scene.cycles.samples=24; scene.cycles.use_denoising=True
try:
    prefs=bpy.context.preferences.addons['cycles'].preferences; prefs.compute_device_type='OPTIX'; prefs.get_devices()
    for d in prefs.devices:d.use=d.type!='CPU'
    if any(d.use for d in prefs.devices):scene.cycles.device='GPU'
except Exception:pass
scene.render.resolution_x=900; scene.render.resolution_y=1000; scene.render.resolution_percentage=100
scene.world.color=(.035,.035,.035)
def aim(o,p):o.rotation_euler=(Vector(p)-o.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.object.camera_add(location=(.9,-6.5,2.8)); cam=bpy.context.object; aim(cam,(0,0,1.45)); cam.data.type='ORTHO'; cam.data.ortho_scale=3.5; scene.camera=cam
for name,loc,color,power,size in [('Warm key',(-3,-4,5),(1,.71,.45),650,4),('Teal rim',(3,1,3),(.16,.7,1),800,3),('Purple fill',(2,-3,1),(.58,.22,1),300,3)]:
    bpy.ops.object.light_add(type='AREA',location=loc); o=bpy.context.object; o.name=name; o.data.energy=power; o.data.color=color; o.data.shape='DISK'; o.data.size=size; aim(o,(0,0,1.6))
scene.render.image_settings.file_format='PNG'; scene.render.filepath=str(OUT/'Suneye-review.png')
scene.view_settings.view_transform='AgX'
stats={'source':rig['reference_url'],'mesh_objects':sum(o.type=='MESH' for o in parts),'curve_objects':sum(o.type=='CURVE' for o in parts),'vertices':sum(len(o.data.vertices) for o in parts if o.type=='MESH'),'status':rig['status']}
(OUT/'Suneye-check.json').write_text(json.dumps(stats,indent=2))
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'Suneye-study.blend'))
print('MODEL_SAVED',json.dumps(stats),flush=True)
bpy.ops.render.render(write_still=True)
print('RENDER_COMPLETE',flush=True)
