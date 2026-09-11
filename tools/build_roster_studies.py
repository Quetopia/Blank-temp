"""Eleven editable Quetopia sculpt studies, based on reviewed TikTok references.
Blender --background --python build_roster_studies.py -- OUT [slug ...]
These are first-pass model studies: no final topology, skin weights or game integration.
Companions other than Reef Lobster are new adaptations of the paired source motifs.
"""
import bpy, math, random, sys, json, traceback
from pathlib import Path
from mathutils import Vector
PI=math.pi
args=sys.argv[sys.argv.index('--')+1:]; OUT=Path(args[0]); OUT.mkdir(parents=True,exist_ok=True)
parts=[]; M={}
def material(name,c,metal=.45,rough=.34,emit=0):
    m=bpy.data.materials.new(name); m.diffuse_color=(*c,1); m.use_nodes=True
    n=m.node_tree.nodes; p=n.get('Principled BSDF'); p.inputs['Base Color'].default_value=(*c,1)
    p.inputs['Metallic'].default_value=metal; p.inputs['Roughness'].default_value=rough
    p.inputs['Emission Color'].default_value=(*c,1); p.inputs['Emission Strength'].default_value=emit
    tex=n.new('ShaderNodeTexNoise'); tex.inputs['Scale'].default_value=115; tex.inputs['Detail'].default_value=2
    bump=n.new('ShaderNodeBump'); bump.inputs['Strength'].default_value=.12; bump.inputs['Distance'].default_value=.012
    m.node_tree.links.new(tex.outputs['Fac'],bump.inputs['Height']); m.node_tree.links.new(bump.outputs['Normal'],p.inputs['Normal'])
    return m
def reset():
    global parts,M
    bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False); parts=[]; random.seed(20)
    M={k:material(k,c,met,r,e) for k,c,met,r,e in [
      ('gold',(.48,.23,.06),.82,.3,0),('ivory',(.65,.51,.37),.2,.4,0),('ink',(.008,.009,.022),.2,.27,0),
      ('purple',(.10,.018,.22),.48,.35,0),('teal',(.018,.26,.25),.62,.33,0),('pink',(.53,.028,.17),.45,.31,0),
      ('cyan',(.025,.55,.9),.25,.25,2),('violet',(.56,.04,.9),.35,.22,1.4),('red',(.32,.012,.014),.48,.38,0),
      ('ember',(.95,.12,.012),.3,.26,1.5),('bone',(.29,.33,.38),.2,.55,0),('linen',(.37,.33,.25),.05,.7,0),
      ('orange',(.78,.12,.017),.4,.32,0),('pearl',(.51,.66,.72),.36,.27,0) ]}
def mesh(name,v,f,mat):
    d=bpy.data.meshes.new(name); d.from_pydata(v,[],f); d.update(); o=bpy.data.objects.new(name,d); bpy.context.collection.objects.link(o); o.data.materials.append(M[mat])
    for p in d.polygons:p.use_smooth=True
    parts.append(o); return o
def sphere(name,loc,scale,mat,seg=32,rings=20):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=seg,ring_count=rings,location=loc); o=bpy.context.object; o.name=name; o.scale=scale; o.data.materials.append(M[mat]); bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    for p in o.data.polygons:p.use_smooth=True
    parts.append(o); return o
def path(name,pts,r,mat):
    c=bpy.data.curves.new(name,'CURVE'); c.dimensions='3D'; c.bevel_depth=r; c.bevel_resolution=2; s=c.splines.new('POLY'); s.points.add(len(pts)-1)
    for p,v in zip(s.points,pts):p.co=(*v,1)
    o=bpy.data.objects.new(name,c); bpy.context.collection.objects.link(o); o.data.materials.append(M[mat]); parts.append(o); return o
def loft(name,pts,radii,mat,n=20):
    v=[]; f=[]
    for i,p in enumerate(pts):
        t=Vector(pts[min(i+1,len(pts)-1)])-Vector(pts[max(0,i-1)])
        t.normalize(); u=t.cross(Vector((0,1,0)))
        if u.length<.01:u=t.cross(Vector((1,0,0)))
        u.normalize(); w=t.cross(u).normalized(); rr=radii[i]; rx,ry=rr if isinstance(rr,tuple) else (rr,rr)
        for j in range(n):v.append(Vector(p)+u*(rx*math.cos(2*PI*j/n))+w*(ry*math.sin(2*PI*j/n)))
    for i in range(len(pts)-1):
        for j in range(n):a=i*n+j; b=i*n+(j+1)%n; f.append((a,b,b+n,a+n))
    f.extend([tuple(reversed(range(n))),tuple((len(pts)-1)*n+j for j in range(n))]); return mesh(name,v,f,mat)
def horn(name,pts,r,mat='gold'):
    return loft(name,pts,[r*(1-i/(len(pts)-1))**.75+.001 for i in range(len(pts))],mat,16)
def jewel(name,p,size,mat='violet'):
    x,y,z=p; v=[(x,y,z+size*1.8),(x,y,z-size*1.35)]+[(x+size*math.cos(i*PI/3),y+size*.65*math.sin(i*PI/3),z) for i in range(6)]
    return mesh(name,v,[(0,2+i,2+(i+1)%6) for i in range(6)]+[(1,2+(i+1)%6,2+i) for i in range(6)],mat)
def eye(x,y,z,s=.07,glow='cyan',slit=False):
    sphere('Eye',(x,y,z),(s,s*.5,s*.66),'pearl'); sphere('Iris',(x,y-s*.48,z),(s*.55,s*.08,s*.57),glow)
    sphere('Pupil',(x,y-s*.57,z),(s*(.13 if slit else .25),s*.035,s*.39),'ink')
    for sign in [-1,1]:path('Eyelid',[(x+s*math.cos(t),y-s*.24,z+sign*s*.68*math.sin(t)) for t in [PI*j/24 for j in range(25)]],s*.09,'gold')
def swirl(x,y,z,s,mat='gold',flip=1):
    path('Engraved scroll',[(x+flip*s*(1-t)*math.cos(t*PI*3),y,z+s*(1-t)*math.sin(t*PI*3)) for t in [i/40 for i in range(41)]],.004,mat)
def face(mat='purple',glow='violet',height=2.05,width=.18):
    # Continuous deformed head surface: brow, cheeks, bridge, lips and chin.
    v=[]; f=[]; seg=64; rings=48
    for j in range(rings+1):
        th=PI*j/rings; zz=.255*math.cos(th); taper=.84+.16*math.sin(th)
        for i in range(seg):
            a=2*PI*i/seg; x=width*math.sin(th)*math.cos(a)*taper; y=.155*math.sin(th)*math.sin(a)
            front=max(0,-math.sin(a))**10
            g=lambda xx,zz0,sx,sz:math.exp(-((x-xx)/sx)**2-((zz-zz0)/sz)**2)
            relief=.07*g(0,-.015,.035,.11)+.025*g(0,-.12,.07,.022)+.014*(g(-.085,.09,.07,.025)+g(.085,.09,.07,.025))-.018*(g(-.078,.045,.046,.025)+g(.078,.045,.046,.025))
            v.append((x,y-front*relief,height+zz))
    for j in range(rings):
        for i in range(seg):a=j*seg+i;b=j*seg+(i+1)%seg;f.append((a,b,b+seg,a+seg))
    mesh('Sculpted head',v,f,mat)
    for s in [-1,1]:
        eye(s*.075,-.147,height+.041,.047,glow)
        sphere('Ear',(s*width*.98,.0,height),(.035,.022,.065),mat)
        path('Brow',[(s*(.034+.09*t),-.153,height+.085+.019*math.sin(t*PI)) for t in [j/18 for j in range(19)]],.01,mat)
        sphere('Nostril',(s*.024,-.213,height-.044),(.012,.007,.008),'ink',16,8)
    path('Mouth seam',[(x,-.163-.012*math.cos(x*25),height-.119+.008*math.cos(x*42)) for x in [-.065+i*.13/24 for i in range(25)]],.005,'ink')
    return height
def body(mat='purple',robe=True):
    zs=[.84,.96,1.12,1.27,1.43,1.57,1.64]; widths=[.19,.21,.15,.17,.25,.29,.13]; depths=[.13,.14,.105,.12,.15,.13,.09]
    loft('Tailored torso',[(0,0,z) for z in zs],list(zip(widths,depths)),mat,48)
    loft('Neck',[(0,0,1.59),(0,0,1.85)], [.085,.075],mat)
    for s in [-1,1]:
        loft('Leg',[(s*.12,0,.91),(s*.14,0,.69),(s*.14,-.02,.5),(s*.15,0,.28),(s*.15,-.005,.12)],[.105,.085,.061,.065,.048],mat)
        sphere('Boot',(s*.15,-.065,.10),(.079,.15,.08),mat)
        loft('Arm',[(s*.27,0,1.54),(s*.35,0,1.43),(s*.40,-.01,1.23),(s*.46,-.06,1.03)],[.088,.08,.052,.045],mat)
        sphere('Palm',(s*.465,-.06,.975),(.051,.03,.068),mat)
        for j in range(4):
            x=s*(.425+j*.023); loft('Finger',[(x,-.07,.95),(x+s*.013,-.08,.90),(x+s*.013,-.087,.865+.012*abs(j-1))],[.012,.01,.006],mat,12)
    if robe:
        v=[];f=[]
        for j in range(25):
            t=j/24; z=.18+1.08*t; r=.33-.17*t
            for i in range(96):
                a=i*2*PI/96; rr=r+.016*math.cos(a*16)*(1-t); v.append((rr*math.cos(a),rr*.66*math.sin(a),z+.013*math.cos(a*8)*(1-t)))
        for j in range(24):
            for i in range(96):a=j*96+i;b=j*96+(i+1)%96;f.append((a,b,b+96,a+96))
        mesh('Pleated ceremonial coat',v,f,mat)
        for i in range(16):
            a=2*PI*i/16;path('Coat embroidered seam',[((.33-.17*t)*math.cos(a),(.33-.17*t)*.67*math.sin(a),.18+1.08*t) for t in [j/24 for j in range(25)]],.006,'gold')
    for z,w,d in zip(zs[1:-1],widths[1:-1],depths[1:-1]):
        for s in [-1,1]:swirl(s*w*.45,-d-.012,z,.042,flip=s)
def crown():
    for i in range(11):
        a=PI*.10+i*PI*.8/10; x=.27*math.cos(a); z=2.06+.30*math.sin(a)
        jewel('Crown crystal',(x,-.02,z),.037+.02*math.sin(a),'violet')
        path('Crown gold stem',[(x*.67,0,z-.17),(x,-.005,z-.025)],.012,'gold')
def diamond():
    body(); face(); crown()
    for s in [-1,1]:
        for j in range(4):
            swirl(s*(.025+j*.025),-.158,2.16-j*.043,.035,flip=s)
        for j in range(5):jewel('Shoulder gem',(s*(.22+.028*j),-.012,1.62+.012*j),.026,'teal')
    jewel('Heart prism',(0,-.167,1.44),.06)
    for i in range(10):
        a=2*PI*i/10;path('Halo arc',[(.38*math.cos(a+t*.2),.13,2.04+.38*math.sin(a+t*.2)) for t in [j/20 for j in range(21)]],.01,'gold')
def moon():
    body('purple'); face('pearl','violet')
    # Large crescent swept around head, hollow interior rather than a solid disk.
    pts=[];rs=[]
    for i in range(81):
        t=i/80; a=-PI*.55+t*PI*1.60; pts.append((.48*math.cos(a),.07,2.03+.48*math.sin(a)));rs.append((.065*math.sin(PI*t)**.65+.001,.08*math.sin(PI*t)**.65+.001))
    loft('Ivory crescent headdress',pts,rs,'pearl',24)
    path('Crescent gold trim',[(x,y-.075,z) for x,y,z in pts],.011,'gold')
    for s in [-1,1]:
        for j in range(6):swirl(s*.10,-.155,1.95+j*.025,.024,flip=s)
    for i in range(5):
        a=i*2*PI/5; jewel('Lunar orbit jewel',(.49*math.cos(a),.06,2.03+.49*math.sin(a)),.026,'cyan')
    path('Lunar staff',[(.64,0,.15),(.64,0,1.86)],.019,'gold')
    sphere('Staff moon',(.64,0,1.96),(.11,.045,.11),'pearl')
def sally():
    body('pink',False); face('ivory','orange')
    for s in [-1,1]:
        for j in range(9):
            x=s*(.015+j*.019); pts=[(x,.025,2.23),(x+s*.025,-.09,2.26),(x+s*.09,-.1,2.1),(x+s*.15,-.03,2.03+j*.009)]
            loft('Rainbow hair lock',pts,[.026,.025,.025,.001],['pink','gold','teal','purple'][j%4],12)
        for j in range(6):
            z=1.05+j*.095; path('Candy corset rib',[(s*.02,-.14,z),(s*.11,-.16,z+.024),(s*.21,-.09,z+.037)],.012,['gold','teal','ivory'][j%3])
        for z in [1.23,.51]:sphere('Exposed mechanical joint',(s*(.40 if z>1 else .14),0,z),(.065,.07,.066),'gold')
        for j in range(3):horn('Jester crown spike',[(s*(.10+j*.06),0,2.23),(s*(.18+j*.075),.015,2.41),(s*(.22+j*.10),.0,2.48-j*.03)],.045,['pink','teal','gold'][j])
        sphere('Cheek paint',(s*.10,-.148,2.005),(.022,.006,.019),'pink')
    for j in range(8):
        a=j*2*PI/8; loft('Skirt ribbon',[(.2*math.cos(a),.14*math.sin(a),1.01),(.26*math.cos(a),.18*math.sin(a),.86),(.3*math.cos(a+.10),.21*math.sin(a+.10),.7)],[.035,.055,.004],['pink','teal','gold','ivory'][j%4],12)
    path('Lollipop staff',[(.65,0,.2),(.65,0,1.7)],.02,'ivory')
    for j in range(4):
        path('Candy spiral',[(.65+.14*t*math.cos(t*PI*5+j*PI/2),-.01,1.82+.14*t*math.sin(t*PI*5+j*PI/2)) for t in [i/80 for i in range(81)]],.021,['pink','gold','teal','ivory'][j])
def cyber():
    body('bone',False); face('bone','cyan')
    for z,s in [(2.17,.025),(2.24,.022),(2.30,.016)]:eye(0,-.123,z,s,'cyan')
    for sign in [-1,1]:
        pts=[(sign*(.02+.10*t),-.16,2.27-.34*t) for t in [j/30 for j in range(31)]]
        path('Face scar seam',pts,.005,'ink')
        for j in range(1,29,2):
            x,y,z=pts[j]; path('Face surgical staple',[(x-.014,y-.005,z+.004),(x,y-.012,z),(x+.014,y-.005,z-.004)],.0035,'gold')
    for j in range(24):
        z=.92+j*.031; w=.18+.045*math.sin((z-.9)*PI)
        path('Crossed torso bindings',[(-w,-.075,z),(0,-.155,z+.065),(w,-.075,z+.13)],.012,'linen')
    for sign in [-1,1]:
        for j in range(15):
            z=.20+j*.043; path('Leg wrapping',[(sign*.14+.066*math.cos(a),.066*math.sin(a),z+.018*a/PI) for a in [i*2*PI/30 for i in range(31)]],.009,'linen')
        for j in range(10):sphere('Necklace bead',(sign*(.035+j*.019),-.16,1.50+.004*j*j),(.013,.013,.019),'gold',12,8)
def tide():
    body('teal'); face('teal','ember')
    for s in [-1,1]:
        for j in range(6):horn('Coral crown',[(s*.11,0,2.20),(s*(.18+j*.015),.015,2.34+j*.024),(s*(.22+j*.025),0,2.33+j*.05)],.021,'orange')
        for j in range(7):
            z=1.1+j*.072; sphere('Overlapping shell armor',(s*.12,-.14,z),(.12,.038,.055),'pearl',24,12)
            swirl(s*.11,-.18,z,.034,'gold',s)
        for j in range(12):
            a=PI*j/11; sphere('Pearl collar',(s*.2*math.cos(a),-.12,1.62+.1*math.sin(a)),(.013,.013,.013),'pearl',12,8)
    path('Trident shaft',[(.63,0,.12),(.63,0,1.94)],.02,'gold')
    for s in [-1,0,1]:horn('Trident prong',[(.63,0,1.72),(.63+s*.12,0,1.92),(.63+s*.12,0,2.12)],.024,'teal')
def dragon(small=False):
    scale=.6 if small else 1; bodymat='orange' if small else 'red'
    loft('Dragon trunk',[(0,.08,.25),(0,.08,.6),(0,.02,.95),(0,0,1.3),(0,0,1.55)],[.18,.31,.25,.16,.12],bodymat,40)
    loft('Dragon skull',[(0,0,1.47),(0,-.015,1.65),(0,-.12,1.78),(0,-.24,1.72)],[(.13,.14),(.18,.15),(.15,.1),(.1,.075)],bodymat,36)
    for s in [-1,1]:
        eye(s*.123,-.13,1.72,.046,'ember',True)
        loft('Dragon haunch',[(s*.2,.06,.69),(s*.34,.02,.4),(s*.30,-.13,.16)],[.15,.13,.075],bodymat)
        loft('Dragon forearm',[(s*.19,0,1.16),(s*.35,-.05,.9),(s*.32,-.25,.73)],[.075,.065,.036],bodymat)
        for j in range(3):horn('Claw',[(s*(.27+j*.042),-.13,.15),(s*(.27+j*.042),-.27,.11),(s*(.27+j*.042),-.32,.075)],.023,'ivory')
        horn('Swept horn',[(s*.12,.05,1.77),(s*.22,.11,1.98),(s*.28,.05,2.13),(s*.23,-.02,2.20)],.062,'ink')
        # Bat wing membrane with rib fans and curved scallops.
        base=(s*.17,.12,1.25); ribs=[]
        for j in range(5):
            end=(s*(.58+.48*math.sin(PI*j/5)),.15,1.72-j*.25)
            mid=(s*.60,.12,1.85-j*.16); pts=[base,mid,end]; ribs.append(pts); loft('Wing finger',pts,[.036,.024,.005],'ink',12)
        for j in range(4):
            a=Vector(ribs[j][-1]);b=Vector(ribs[j+1][-1]);v=[base];
            for k in range(21):
                t=k/20;p=a.lerp(b,t);p.x-=s*.1*math.sin(PI*t); v.append(p)
            mesh('Scalloped wing membrane',v,[(0,k+1,k+2) for k in range(20)],bodymat)
        for j in range(10):horn('Cheek spine',[(s*.10,-.13,1.65-j*.06),(s*.22,-.10,1.68-j*.06),(s*.25,-.11,1.73-j*.06)],.015,'gold')
    tail=[]
    for i in range(61):
        t=i/60;a=t*PI*1.6;tail.append((.62*math.sin(a)*t,.16+.4*math.cos(a)*t,.3-.15*t+.13*t*t))
    loft('Coiled dragon tail',tail,[.10*(1-i/60)+.004 for i in range(61)],bodymat)
    for i in range(4,59,3):
        x,y,z=tail[i];horn('Tail spine',[(x,y,z),(x+.015,y,z+.09),(x+.04,y,z+.13)],.019,'ivory')
    for j in range(16):
        z=.47+j*.073; sphere('Ventral armor scale',(0,-.18+.05*(z-1),z),(.12*(1-.3*abs(z-1)),.03,.05),'gold',20,12)
    for o in parts:
        if small:o.scale*=scale; o.location*=scale
def moth():
    sphere('Moth thorax',(0,0,.8),(.105,.11,.21),'purple');loft('Moth abdomen',[(0,0,.8),(0,0,.55),(0,0,.35)],[.085,.08,.018],'teal')
    for s in [-1,1]:
        eye(s*.05,-.08,.96,.031,'violet')
        horn('Feather antenna',[(s*.04,0,1.0),(s*.14,0,1.20),(s*.26,0,1.24)],.015)
        for l in [0,1]:
            v=[];f=[]
            for j in range(31):
                t=j/30;a=(-.18 if l==0 else -1.3)+t*(1.6 if l==0 else 1.15);r=(.75 if l==0 else .54)*math.sin(PI*t)**.45
                for k in range(9):
                    u=k/8;v.append((s*(.04+r*u*math.cos(a)),.04+.055*u*u,.8+r*u*math.sin(a)))
            for j in range(30):
                for k in range(8):q=j*9+k;f.append((q,q+1,q+10,q+9))
            mesh('Sculpted moth wing',v,f,'teal' if l else 'purple')
            path('Wing gold edge',[v[j*9+8] for j in range(31)],.009,'gold')
            for j in range(3,29,3):path('Wing vein',[v[j*9+k] for k in range(9)],.005,'gold')
            for j in [8,15,22]:
                x,y,z=v[j*9+6];jewel('Wing moonstone',(x,y-.02,z),.026,'pearl')
        for i in range(3):path('Moth foot',[(s*.08,-.03,.78-i*.08),(s*.17,-.1,.7-i*.08),(s*.25,-.12,.65-i*.08)],.008,'gold')
def imp():
    sphere('Imp bellows body',(0,0,.62),(.20,.14,.23),'pink');face('gold','cyan',1.02,.16)
    for s in [-1,1]:
        horn('Imp horn',[(s*.1,0,1.22),(s*.22,0,1.35),(s*.29,0,1.3)],.047,'teal')
        loft('Imp arm',[(s*.18,0,.73),(s*.32,0,.62),(s*.35,-.08,.79)],[.035,.032,.02],'gold')
        sphere('Imp claw',(s*.35,-.08,.82),(.045,.035,.057),'teal')
        loft('Imp bent leg',[(s*.1,0,.45),(s*.18,-.02,.27),(s*.13,-.08,.13)],[.053,.035,.028],'gold')
        sphere('Imp shoe',(s*.13,-.10,.11),(.07,.12,.055),'purple')
    for j in range(6):path('Bellows rib',[(-.18,-.04,.48+j*.05),(0,-.151,.48+j*.05),(.18,-.04,.48+j*.05)],.009,'gold')
    path('Imp winding tail',[(.12,0,.45),(.31,.05,.35),(.45,0,.43),(.46,-.02,.57)],.016,'teal')
    jewel('Tail spark',(.46,-.02,.62),.04,'ember')
def wisp():
    sphere('Lens wisp shell',(0,0,.85),(.30,.18,.30),'bone');eye(0,-.18,.85,.18,'cyan')
    for j in range(3):eye(0,-.07,1.09+j*.06,.024,'cyan')
    for s in [-1,1]:
        for i in range(4):
            a=i*.35;horn('Sensor tendril',[(s*.2,.04,.7+i*.05),(s*(.4+a*.1),.05,.6+i*.09),(s*(.49+a*.1),0,.71+i*.09)],.025,'gold')
    for j in range(5):
        path('Hanging binding',[(.09*math.sin(t*7+j),.05,.62-t*.4) for t in [i/25 for i in range(26)]],.012,'linen')
    for i in range(40):
        a=i*2*PI/40; sphere('Lens rivet',(.26*math.cos(a),-.12,.85+.26*math.sin(a)),(.014,.018,.014),'gold',12,8)
def lobster():
    loft('Segmented lobster body',[(0,.1,.25),(0,.07,.45),(0,0,.69),(0,0,.82)],[.14,.2,.17,.1],'orange',32)
    for s in [-1,1]:
        sphere('Eye shell',(s*.16,-.01,.94),(.18,.11,.22),'orange');eye(s*.16,-.11,.96,.14,'ember',True)
        horn('Long antenna',[(s*.12,0,1.07),(s*.24,.0,1.28),(s*.31,-.05,1.51)],.012,'gold')
        loft('Claw arm',[(s*.15,0,.61),(s*.30,-.03,.51),(s*.41,-.12,.54)],[.052,.043,.041],'orange')
        sphere('Pincer palm',(s*.44,-.13,.61),(.14,.09,.16),'orange')
        for d in [-1,1]:horn('Curved pincer',[(s*.44+d*.08,-.13,.66),(s*.44+d*.095,-.15,.78),(s*.44+d*.033,-.16,.88)],.05,'orange')
        for j in range(4):
            z=.35+j*.085; loft('Walking leg',[(s*.15,.02,z),(s*(.31+j*.025),.07,z-.1),(s*(.37+j*.025),-.04,.08)],[.025,.019,.008],'orange',12)
        for i in range(26):
            a=2*PI*i/26;sphere('Eye pearl stud',(s*.16+.17*math.cos(a),-.08,.94+.21*math.sin(a)),(.010,.012,.011),'pearl',10,6)
        for j in range(18):
            a=j*2.4;r=.11*math.sqrt(j/18);sphere('Claw pearl stud',(s*.44+r*math.cos(a),-.217,.61+r*math.sin(a)),(.009,.009,.009),'pearl',10,6)
    for j in range(7):path('Tail plated ring',[(.15*math.cos(a),.07+.11*math.sin(a),.24+j*.055) for a in [2*PI*i/32 for i in range(33)]],.012,'gold')
    for i in range(5):loft('Tail fan',[(0,.12,.26),((i-2)*.065,.19,.13),((i-2)*.075,.23,.08)],[.04,.048,.002],'teal',12)
MODELS=[('diamond-girl','Diamond Girl',diamond,'7673959393678920991'),('crescent-weaver','Crescent Weaver',moon,'7678226230482685214'),('ember-sovereign','Ember Sovereign',dragon,'7683522615893363998'),('sally','Sally',sally,'7683317432655596830'),('cyberdine','Cyberdine',cyber,'7681890768092499231'),('abyssal-cantor','Abyssal Cantor',tide,'7682561983111023902'),('orrery-moth','Orrery Moth',moth,'7678226230482685214'),('cinderling','Cinderling',lambda:dragon(True),'7683522615893363998'),('spark-imp','Spark Imp',imp,'7683317432655596830'),('lens-wisp','Lens Wisp',wisp,'7681890768092499231'),('reef-lobster','Reef Lobster',lobster,'7682561983111023902')]
def finish(slug,label,source):
    dest=OUT/slug;dest.mkdir(exist_ok=True)
    # Bake curve geometry into the editable mesh study; source generator stays parametric.
    for o in parts:
        if o.type=='CURVE':
            bpy.ops.object.select_all(action='DESELECT');o.select_set(True);bpy.context.view_layer.objects.active=o;bpy.ops.object.convert(target='MESH')
    # Consolidate draw objects by material. No geometry reduction or false game-ready claim.
    grouped=[]
    batches=[(mat,[o for o in parts if o.type=='MESH' and o.data.materials and o.data.materials[0]==mat]) for mat in M.values()]
    for mat,batch in batches:
        if not batch:continue
        bpy.ops.object.select_all(action='DESELECT')
        for o in batch:o.select_set(True)
        bpy.context.view_layer.objects.active=batch[0];bpy.ops.object.join();batch[0].name=label+' / '+mat.name;grouped.append(batch[0])
    bpy.ops.object.empty_add();root=bpy.context.object;root.name=label+' — MODEL STUDY'
    for o in grouped:o.parent=root
    root['source']='https://www.tiktok.com/@quetopia3/video/'+source
    root['status']='Sculpt study. Static geometry. No production rig, UV bake, LODs or game integration.'
    bpy.ops.object.select_all(action='DESELECT');root.select_set(True)
    for o in grouped:o.select_set(True)
    bpy.context.view_layer.objects.active=root
    bpy.ops.export_scene.gltf(filepath=str(dest/(slug+'.glb')),export_format='GLB',use_selection=True,export_apply=True)
    corners=[o.matrix_world@Vector(c) for o in grouped for c in o.bound_box];lo=Vector(tuple(min(p[i] for p in corners) for i in range(3)));hi=Vector(tuple(max(p[i] for p in corners) for i in range(3)));center=(lo+hi)/2;size=hi-lo
    scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.samples=20;scene.cycles.use_denoising=True
    try:
        prefs=bpy.context.preferences.addons['cycles'].preferences;prefs.compute_device_type='OPTIX';prefs.get_devices()
        for d in prefs.devices:d.use=d.type!='CPU'
        if any(d.use for d in prefs.devices):scene.cycles.device='GPU'
    except Exception:pass
    scene.world.color=(.025,.025,.035);scene.view_settings.view_transform='AgX'
    def aim(o,p):o.rotation_euler=(Vector(p)-o.location).to_track_quat('-Z','Y').to_euler()
    bpy.ops.object.camera_add(location=center+Vector((.65,-6,1.15)));cam=bpy.context.object;aim(cam,center);cam.data.type='ORTHO';cam.data.ortho_scale=max(size.z,size.x*1.25)*1.22;scene.camera=cam
    for loc,col,energy in [((-3,-4,5),(1,.8,.62),500),((3,1,3),(.12,.65,1),650),((2,-3,1),(.55,.23,1),180)]:
        bpy.ops.object.light_add(type='AREA',location=loc);o=bpy.context.object;o.data.energy=energy;o.data.color=col;o.data.shape='DISK';o.data.size=3;aim(o,center)
    scene.render.resolution_x=640;scene.render.resolution_y=800;scene.render.resolution_percentage=100;scene.render.image_settings.file_format='PNG';scene.render.filepath=str(dest/(slug+'.png'))
    stats={'slug':slug,'label':label,'source':root['source'],'vertices':sum(len(o.data.vertices) for o in grouped),'mesh_objects':len(grouped),'status':root['status'],'bounds':list(size)}
    (dest/'check.json').write_text(json.dumps(stats,indent=2))
    bpy.ops.wm.save_as_mainfile(filepath=str(dest/(slug+'.blend')));print('SAVED '+slug,flush=True)
    bpy.ops.render.render(write_still=True);print('RENDERED '+slug,flush=True)
    return stats
results=[]; failures=[]
for slug,label,fn,source in MODELS:
    if len(args)>1 and slug not in args[1:]:continue
    try:
        reset();fn();results.append(finish(slug,label,source));(OUT/'batch-checkpoint.json').write_text(json.dumps(results,indent=2))
    except Exception as e:
        failures.append({'slug':slug,'error':str(e)})
        traceback.print_exc();print('FAILED '+slug+': '+str(e),flush=True)
print('BATCH_COMPLETE '+str(len(results)),flush=True)
if failures:
    (OUT/'batch-errors.json').write_text(json.dumps(failures,indent=2))
    sys.exit(1)
