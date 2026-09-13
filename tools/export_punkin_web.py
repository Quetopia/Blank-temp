"""Export the saved Blender study for the grove's browser renderer.
Blender --background --python export_punkin_web.py -- source.blend output.gltf
"""
import bpy, os, json, base64, sys
source, path = sys.argv[sys.argv.index('--') + 1:]
bpy.ops.wm.open_mainfile(filepath=os.path.abspath(source))
bpy.context.scene.frame_set(1)
bpy.ops.object.select_all(action='DESELECT')
rig=bpy.data.objects['Punkin']
rig.select_set(True)
for o in bpy.data.objects:
    if o.type=='MESH' and o.parent==rig: o.select_set(True)
bpy.context.view_layer.objects.active=rig
path=os.path.abspath(path)
os.makedirs(os.path.dirname(path),exist_ok=True)
bpy.ops.export_scene.gltf(filepath=path,export_format='GLTF_SEPARATE',use_selection=True,
    export_animations=True,export_animation_mode='SCENE',export_force_sampling=True)
with open(path) as f: data=json.load(f)
for buffer in data.get('buffers',[]):
    with open(os.path.join(os.path.dirname(path),buffer['uri']),'rb') as f: raw=f.read()
    buffer['uri']='data:application/octet-stream;base64,'+base64.b64encode(raw).decode('ascii')
with open(path,'w') as f: json.dump(data,f,separators=(',',':'))
print('PUNKIN_WEB_EXPORTED',os.path.getsize(path),'animations',len(data.get('animations',[])),flush=True)
