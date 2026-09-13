"""Original Punkin motion-study asset. Run with Blender --background --python.
Produces a skinned FBX, editable blend, contact-sheet renders and gait checks.
This is an animation prototype, not the finished reference-quality character.
"""
import bpy, math, json, os, sys
from mathutils import Vector

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'PunkinMotionLab', 'Assets', 'Punkin')
if '--' in sys.argv:
    OUT = sys.argv[sys.argv.index('--') + 1]
os.makedirs(OUT, exist_ok=True)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
scene = bpy.context.scene
scene.render.fps = 30
scene.frame_start, scene.frame_end = 1, 61

def mat(name, color, metal=0):
    m = bpy.data.materials.new(name)
    m.diffuse_color = (*color, 1)
    m.use_nodes = True
    p = m.node_tree.nodes.get('Principled BSDF')
    p.inputs['Base Color'].default_value = (*color, 1)
    p.inputs['Roughness'].default_value = .72
    p.inputs['Metallic'].default_value = metal
    return m

fur = mat('Punkin ginger', (.61, .255, .066))
stripe = mat('Tabby stripes', (.28, .088, .026))
cream = mat('Warm cream', (.87, .69, .43))
green = mat('Forest wool', (.07, .16, .082))
gold = mat('Old brass', (.55, .36, .10), .65)
leather = mat('Satchel leather', (.13, .07, .035))
eye = mat('Amber green eyes', (.42, .51, .10))
black = mat('Pupils', (.009, .013, .007))
pink = mat('Nose and ears', (.37, .14, .105))
parts = []
details = []

def ell(name, loc, scale, material=fur, bone=None):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=24, ring_count=16, location=loc)
    o = bpy.context.object
    o.name = name
    o.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    o.data.materials.append(material)
    for p in o.data.polygons: p.use_smooth = True
    if bone: details.append((o, bone))
    return o

def linkmesh(name, a, b, r1, r2, material=fur, bone=None):
    d = Vector(b) - Vector(a)
    o = ell(name, (Vector(a)+Vector(b))/2, (r1, r2, d.length*.65), material, bone)
    o.rotation_euler = d.to_track_quat('Z', 'Y').to_euler()
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=False)
    return o

parts += [ell('Ribcage', (0,.14,1.03), (.31,.60,.36)),
          ell('Haunches', (0,-.43,1.02), (.32,.34,.37)),
          ell('Neck', (0,.61,1.22), (.25,.28,.34)),
          ell('Head', (0,.80,1.49), (.32,.29,.29))]
# Bone definitions in Blender coordinates: +Y is forward, +Z is up.
bones = [('root',(0,0,0),(0,0,.2),None),
         ('spine',(0,-.45,1.03),(0,.37,1.10),'root'),
         ('head',(0,.37,1.10),(0,.84,1.52),'spine')]
legs = []
for side, x in [('L',.235),('R',-.235)]:
    for kind in ['front','hind']:
        n = kind + '.' + side
        if kind == 'front':
            pts = [(x,.42,1.05),(x,.32,.63),(x,.51,.19),(x,.65,.10)]
            radii = [(.125,.13),(.078,.085),(.10,.075)]
        else:
            pts = [(x,-.47,1.04),(x,-.20,.66),(x,-.62,.30),(x,-.53,.12)]
            radii = [(.17,.18),(.09,.10),(.065,.068)]
        names = [n+'.upper',n+'.lower',n+'.ankle']
        for i in range(3):
            bones.append((names[i],pts[i],pts[i+1],'spine' if i==0 else names[i-1]))
            parts.append(linkmesh(names[i],pts[i],pts[i+1],*radii[i]))
        toe = (x,pts[-1][1]+.16,.105)
        bones.append((n+'.paw',pts[-1],toe,names[-1]))
        parts.append(ell(n+'.foot',(x,pts[-1][1]+.05,.115),(.105,.165,.105)))
        legs.append((n,pts[-1],kind,side))

# Soft silhouette: fuse torso and whole legs into one continuous skin.
bpy.ops.object.select_all(action='DESELECT')
for o in parts: o.select_set(True)
bpy.context.view_layer.objects.active = parts[0]
bpy.ops.object.join()
skin = bpy.context.object
skin.name = 'Punkin continuous body skin'
bpy.ops.object.transform_apply(location=True,rotation=True,scale=True)
remesh = skin.modifiers.new('Organic union','REMESH')
remesh.mode = 'VOXEL'
remesh.voxel_size = .032
bpy.ops.object.modifier_apply(modifier=remesh.name)
smooth = skin.modifiers.new('Smooth silhouette','SMOOTH')
smooth.factor = 1.1
smooth.iterations = 5
bpy.ops.object.modifier_apply(modifier=smooth.name)
skin.data.materials.clear()
for m in [fur,stripe,cream]: skin.data.materials.append(m)
for p in skin.data.polygons:
    p.use_smooth = True
    x,y,z = p.center
    band = math.sin(y*29 + 2.3*math.sin(z*7) + abs(x)*7)
    p.material_index = 1 if band > .79 and z > .40 else 0
    if z < .20: p.material_index = 2

# Face, tapered ears, whiskers, cape, clasp, and little side satchel.
for s in [-1,1]:
    ell('Muzzle', (s*.105,1.036,1.40),(.13,.095,.09),cream,'head')
    ell('Eye rim',(s*.172,1.014,1.56),(.104,.047,.096),stripe,'head')
    ell('Eye',(s*.172,1.051,1.563),(.080,.023,.076),eye,'head')
    ell('Vertical pupil',(s*.172,1.073,1.565),(.017,.009,.057),black,'head')
    ell('Eye glint',(s*.156,1.080,1.596),(.011,.006,.012),cream,'head')
    verts = [(s*.12,.73,1.65),(s*.31,.72,1.64),(s*.27,.75,1.99),
             (s*.12,.90,1.65),(s*.31,.87,1.64),(s*.27,.80,1.97)]
    mesh = bpy.data.meshes.new('Ear mesh')
    mesh.from_pydata(verts,[],[(0,1,2),(3,5,4),(0,3,4,1),(1,4,5,2),(2,5,3,0)])
    o=bpy.data.objects.new('Pointed ear',mesh); bpy.context.collection.objects.link(o)
    mesh.materials.append(fur); mesh.materials.append(pink); mesh.polygons[1].material_index=1
    bevel=o.modifiers.new('Soft ear edge','BEVEL'); bevel.width=.026; bevel.segments=3
    details.append((o,'head'))
    for i in range(3):
        linkmesh('Whisker',(s*.16,1.10,1.415-i*.018),(s*(.43+i*.025),1.13,1.42-i*.038),.003,.003,cream,'head')
ell('Chin',(0,1.005,1.32),(.16,.092,.055),cream,'head')
ell('Nose',(0,1.129,1.448),(.055,.025,.033),pink,'head')
ell('Green shoulder mantle',(0,.33,1.31),(.345,.33,.12),green,'spine')
ell('Brass cloak clasp',(0,.631,1.26),(.067,.024,.068),gold,'spine')
ell('Leather satchel',(.34,-.12,1.00),(.075,.18,.19),leather,'spine')
ell('Satchel buckle',(.414,-.08,1.045),(.015,.036,.036),gold,'spine')
# Cape is a curved cloth surface, leaving the moving legs visible.
verts=[]; faces=[]
for j in range(9):
    t=j/8
    for i in range(13):
        a=(i/12-.5)*math.pi*1.28
        verts.append((math.sin(a)*(.33+t*.055),.35-t*.98,1.10+math.cos(a)*(.32-t*.06)))
for j in range(8):
    for i in range(12):
        k=j*13+i; faces.append((k,k+1,k+14,k+13))
mesh=bpy.data.meshes.new('Cape cloth'); mesh.from_pydata(verts,[],faces)
o=bpy.data.objects.new('Ranger cape',mesh); bpy.context.collection.objects.link(o)
mesh.materials.append(green)
for p in mesh.polygons: p.use_smooth=True
sol=o.modifiers.new('Cloth thickness','SOLIDIFY'); sol.thickness=.018
details.append((o,'spine'))
tailpts=[(0,-.67,1.12),(0,-.94,1.26),(0,-1.18,1.49),(0,-1.38,1.72),(0,-1.57,1.78),(0,-1.71,1.68)]
for i in range(5):
    n='tail.'+str(i)
    bones.append((n,tailpts[i],tailpts[i+1],'spine' if i==0 else 'tail.'+str(i-1)))

arm=bpy.data.armatures.new('Punkin skeleton')
rig=bpy.data.objects.new('Punkin',arm); bpy.context.collection.objects.link(rig)
bpy.context.view_layer.objects.active=rig; rig.select_set(True)
bpy.ops.object.mode_set(mode='EDIT')
for name,a,b,parent in bones:
    eb=arm.edit_bones.new(name); eb.head=a; eb.tail=b
    if parent: eb.parent=arm.edit_bones[parent]
bpy.ops.object.mode_set(mode='OBJECT')
rig.show_in_front=True

def bind(o, weights):
    for name, assignments in weights.items():
        g=o.vertex_groups.new(name=name)
        for index,w in assignments: g.add([index],w,'REPLACE')
    o.parent=rig
    mod=o.modifiers.new('Skeleton deformation','ARMATURE'); mod.object=rig

def distance(p,a,b):
    a,b=Vector(a),Vector(b); d=b-a
    return (p-(a+d*max(0,min(1,(p-a).dot(d)/d.length_squared)))).length

weights={n:[] for n,a,b,par in bones if n!='root' and not n.startswith('tail')}
for v in skin.data.vertices:
    p=v.co
    candidates=[]
    for n,a,b,par in bones:
        if n not in weights: continue
        if p.z < .79 and (n in ['spine','head']): continue
        if p.z < .88 and (('.L' in n and p.x<0) or ('.R' in n and p.x>0)): continue
        if p.z<.7 and (('front' in n and p.y<0) or ('hind' in n and p.y>0)): continue
        candidates.append((distance(p,a,b),n))
    nearest=sorted(candidates)[:2]
    values=[1/(d+.035)**5 for d,n in nearest]; total=sum(values)
    for (_,n),w in zip(nearest,values): weights[n].append((v.index,w/total))
bind(skin,weights)
for o,n in details:
    bind(o,{n:[(v.index,1) for v in o.data.vertices]})

# A single tapered tail skin spans the chain, avoiding bead-like joint gaps.
tv=[]; tf=[]; tw={f'tail.{i}':[] for i in range(5)}
for j in range(26):
    t=j/5; seg=min(4,int(t)); u=t-seg
    a,b=Vector(tailpts[seg]),Vector(tailpts[seg+1])
    center=a.lerp(b,u); tangent=(b-a).normalized()
    across=Vector((1,0,0)); other=tangent.cross(across).normalized()
    radius=.089*(1-.78*j/25)
    for k in range(16):
        angle=k*math.tau/16
        tv.append(center+radius*(math.cos(angle)*across+math.sin(angle)*other))
        # Blend the final half of each span into the following tail bone.
        blend=max(0,(u-.5)*2) if seg<4 else 0
        tw[f'tail.{seg}'].append((j*16+k,1-blend))
        if blend: tw[f'tail.{seg+1}'].append((j*16+k,blend))
        if j<25: tf.append((j*16+k,j*16+(k+1)%16,(j+1)*16+(k+1)%16,(j+1)*16+k))
tf += [tuple(reversed(range(16))),tuple(range(400,416))]
tm=bpy.data.meshes.new('Continuous tail skin'); tm.from_pydata(tv,[],tf)
tail=bpy.data.objects.new('Punkin tapered tail',tm); bpy.context.collection.objects.link(tail)
tm.materials.append(fur); tm.materials.append(stripe)
for p in tm.polygons: p.use_smooth=True; p.material_index=1 if (p.index//16)%5==2 else 0
bind(tail,tw)

targets=[]
for n,foot,kind,side in legs:
    target=bpy.data.objects.new(n+'.IK',None); bpy.context.collection.objects.link(target)
    target.location=foot; target.empty_display_size=.08
    ik=rig.pose.bones[n+'.ankle'].constraints.new('IK')
    ik.target=target; ik.chain_count=3; ik.use_tail=True
    # Rest-pose bend establishes the knee direction; modest stride avoids flips.
    paw=rig.pose.bones[n+'.paw']
    keep=paw.constraints.new('COPY_ROTATION'); keep.target=target
    keep.target_space='WORLD'; keep.owner_space='WORLD'
    targets.append((target,Vector(foot),kind,side))

# Four-beat walk: left hind, left front, right hind, right front.
# Feet spend 64% of each stride planted, with a smooth lifted return arc.
phases={('hind','L'):0,('front','L'):.25,('hind','R'):.5,('front','R'):.75}
for frame in range(1,62):
    t=(frame-1)/60
    for target,base,kind,side in targets:
        q=(t+phases[(kind,side)])%1
        if q<.64:
            dy=.22-.44*q/.64; lift=0
        else:
            u=(q-.64)/.36
            dy=-.22+.44*(u*u*(3-2*u)); lift=.145*math.sin(math.pi*u)**2
        target.location=base+Vector((0,dy,lift))
        target.keyframe_insert('location',frame=frame)
    for name in ['spine','head']+[f'tail.{i}' for i in range(5)]:
        pb=rig.pose.bones[name]; pb.rotation_mode='XYZ'
        if name=='spine':
            pb.location.z=.013*math.cos(t*4*math.pi)
            pb.rotation_euler=(0,.022*math.sin(t*2*math.pi),.022*math.sin(t*2*math.pi))
            pb.keyframe_insert('location',frame=frame)
        elif name=='head': pb.rotation_euler=(.018*math.sin(t*4*math.pi),0,-.018*math.sin(t*2*math.pi))
        else: pb.rotation_euler=(.018*math.sin(t*2*math.pi),.07*math.sin(t*2*math.pi+int(name[-1])*.4),0)
        pb.keyframe_insert('rotation_euler',frame=frame)
rig.animation_data.action.name='Punkin_Walk'

# Check the evaluated skeleton, including the entire legs, before export.
samples={n:[] for n,a,b,p in bones}
footerrors=[]
for frame in range(1,62):
    scene.frame_set(frame); bpy.context.view_layer.update()
    for n in samples: samples[n].append(list(rig.pose.bones[n].matrix.to_quaternion()))
    for target,base,kind,side in targets:
        n=kind+'.'+side
        footerrors.append((rig.pose.bones[n+'.ankle'].tail-target.location).length)
legmotion={n:max(sum((a-b)**2 for a,b in zip(q,samples[n][0]))**.5 for q in samples[n]) for n in samples if any(k in n for k in ['upper','lower','ankle'])}
report={'bones':len(bones),'skin_vertices':len(skin.data.vertices),'frames':61,
        'max_ik_error':max(footerrors),'leg_rotation_changes':legmotion,
        'all_leg_segments_move':all(v>.02 for v in legmotion.values()),
        'loop_quaternion_error':max(sum((a-b)**2 for a,b in zip(v[0],v[-1]))**.5 for v in samples.values()),
        'status':'motion prototype; appearance and gait require review'}
with open(os.path.join(OUT,'gait-check.json'),'w') as f: json.dump(report,f,indent=2)
print('PUNKIN_GAIT_CHECK',json.dumps(report),flush=True)
scene.frame_set(1)
bpy.ops.object.select_all(action='DESELECT')
rig.select_set(True); skin.select_set(True)
tail.select_set(True)
for o,n in details: o.select_set(True)
bpy.context.view_layer.objects.active=rig
bpy.ops.export_scene.fbx(filepath=os.path.join(OUT,'Punkin.fbx'),use_selection=True,
    object_types={'ARMATURE','MESH'},add_leaf_bones=False,bake_anim=True,
    apply_scale_options='FBX_SCALE_ALL',apply_unit_scale=True,
    bake_anim_use_all_actions=False,bake_anim_use_nla_strips=False,
    bake_anim_simplify_factor=0,axis_forward='-Z',axis_up='Y')

# Small studio for inspection; never exported into the character FBX.
ground=mat('Studio slate',(.025,.040,.043))
bpy.ops.mesh.primitive_plane_add(size=200); bpy.context.object.data.materials.append(ground)
world=scene.world or bpy.data.worlds.new('Studio'); scene.world=world
world.use_nodes=True; world.node_tree.nodes['Background'].inputs[0].default_value=(.16,.20,.23,1)
world.node_tree.nodes['Background'].inputs[1].default_value=.4
for loc,power,size in [((3,4,6),650,5),((-4,1,3),450,4),((0,-4,4),750,3)]:
    bpy.ops.object.light_add(type='AREA',location=loc); o=bpy.context.object; o.data.energy=power; o.data.shape='DISK'; o.data.size=size
    o.rotation_euler=(Vector((0,0,1))-o.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.object.camera_add(location=(3.4,4.2,2.8)); cam=bpy.context.object
cam.rotation_euler=(Vector((0,-.1,1))-cam.location).to_track_quat('-Z','Y').to_euler()
cam.data.type='ORTHO'; cam.data.ortho_scale=3.65; scene.camera=cam
scene.render.engine='CYCLES'; scene.cycles.samples=16
scene.render.resolution_x=900; scene.render.resolution_y=900; scene.render.resolution_percentage=100
source_dir=os.path.join(os.path.dirname(os.path.dirname(OUT)),'SourceArt')
os.makedirs(source_dir,exist_ok=True)
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(source_dir,'Punkin.blend'))
scene.frame_set(12); scene.render.filepath=os.path.join(OUT,'Punkin-preview.png')
bpy.ops.render.render(write_still=True)
print('PUNKIN_BUILD_COMPLETE',OUT,flush=True)
