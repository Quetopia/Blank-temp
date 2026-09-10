using System;
using System.IO;
using System.Linq;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.Rendering;

public static class PunkinSceneBuilder
{
    public static void BuildPreview()
    {
        PlayerSettings.productName="Punkin Motion Study";
        PlayerSettings.defaultScreenWidth=1280; PlayerSettings.defaultScreenHeight=800;
        PlayerSettings.fullScreenMode=FullScreenMode.Windowed;
        string output=Path.GetFullPath("../PunkinMotionPreview/PunkinMotion.exe");
        Directory.CreateDirectory(Path.GetDirectoryName(output));
        var report=BuildPipeline.BuildPlayer(new BuildPlayerOptions {
            scenes=new[]{"Assets/Scenes/PunkinMotion.unity"}, locationPathName=output,
            target=BuildTarget.StandaloneWindows64, options=BuildOptions.Development });
        if(report.summary.result!=UnityEditor.Build.Reporting.BuildResult.Succeeded)
            throw new Exception("Preview build failed: "+report.summary.result);
        Debug.Log("PUNKIN_PREVIEW_PASS "+output);
    }

    public static void Build()
    {
        const string path = "Assets/Punkin/Punkin.fbx";
        AssetDatabase.Refresh();
        var importer = AssetImporter.GetAtPath(path) as ModelImporter;
        if (importer == null) throw new Exception("Punkin FBX missing");
        importer.animationType = ModelImporterAnimationType.Legacy;
        importer.importAnimation = true;
        importer.globalScale = .01f; // Blender FBX exports these mesh units as centimetres.
        importer.materialImportMode = ModelImporterMaterialImportMode.ImportStandard;
        var clips = importer.defaultClipAnimations;
        foreach (var c in clips) { c.name = "Punkin_Walk"; c.loopTime = true; c.wrapMode = WrapMode.Loop; }
        importer.clipAnimations = clips;
        importer.SaveAndReimport();
        var source = AssetDatabase.LoadAssetAtPath<GameObject>(path);
        var animationClips = AssetDatabase.LoadAllAssetsAtPath(path).OfType<AnimationClip>()
            .Where(c => !c.name.StartsWith("__preview__")).ToArray();
        if (source == null || animationClips.Length == 0) throw new Exception("FBX model/animation import failed");
        var scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
        var heading = new GameObject("Punkin smooth heading");
        var cat = (GameObject)PrefabUtility.InstantiatePrefab(source);
        cat.transform.SetParent(heading.transform, false);
        // Verify the imported skeleton and calculate its actual forward axis.
        var all = cat.GetComponentsInChildren<Transform>();
        var head = all.First(t => t.name == "head");
        var spine = all.First(t => t.name == "spine");
        Vector3 forward = head.position - spine.position; forward.y=0;
        if (forward.sqrMagnitude > .001f)
            cat.transform.rotation = Quaternion.FromToRotation(forward.normalized, Vector3.forward);
        var renderers = cat.GetComponentsInChildren<Renderer>();
        Bounds bounds = renderers[0].bounds;
        foreach (var r in renderers) bounds.Encapsulate(r.bounds);
        if (bounds.size.y < .1f || bounds.size.y > 10) throw new Exception("Unexpected FBX scale: " + bounds.size);
        cat.transform.position -= Vector3.up * bounds.min.y;
        var anim = cat.GetComponent<Animation>() ?? cat.AddComponent<Animation>();
        var clip = animationClips[0];
        clip.wrapMode = WrapMode.Loop;
        anim.AddClip(clip, "Punkin_Walk"); anim.clip=clip; anim.wrapMode=WrapMode.Loop;
        anim.playAutomatically=true; anim.Play("Punkin_Walk");
        var motion=heading.AddComponent<PunkinMotion>(); motion.walk=anim; motion.clipName="Punkin_Walk";
        var joints=all.Where(t=>t.name.EndsWith(".upper") || t.name.EndsWith(".lower") || t.name.EndsWith(".ankle")).ToArray();
        if(joints.Length!=12) throw new Exception("Expected 12 articulated leg segments, got "+joints.Length);
        clip.SampleAnimation(cat,0);
        var rest=joints.Select(t=>t.localRotation).ToArray();
        var changes=new float[joints.Length];
        for(int f=1;f<30;f++)
        {
            clip.SampleAnimation(cat,clip.length*f/30f);
            for(int i=0;i<joints.Length;i++) changes[i]=Mathf.Max(changes[i],Quaternion.Angle(rest[i],joints[i].localRotation));
        }
        if(changes.Any(a=>a<1)) throw new Exception("Imported leg segment does not animate: "+string.Join(",",changes));
        clip.SampleAnimation(cat,0);
        var floor=GameObject.CreatePrimitive(PrimitiveType.Plane); floor.name="Motion inspection floor";
        floor.transform.localScale=Vector3.one*2;
        var material=new Material(Shader.Find("Standard")); material.color=new Color(.065f,.095f,.09f);
        AssetDatabase.CreateAsset(material,"Assets/Punkin/StudioFloor.mat");
        floor.GetComponent<Renderer>().sharedMaterial=material;
        var light=new GameObject("Soft key").AddComponent<Light>(); light.type=LightType.Directional;
        light.intensity=1.5f; light.transform.rotation=Quaternion.Euler(45,-35,0); light.shadows=LightShadows.Soft;
        RenderSettings.ambientMode=AmbientMode.Flat; RenderSettings.ambientLight=new Color(.44f,.48f,.51f);
        var camera=new GameObject("Main Camera").AddComponent<Camera>(); camera.tag="MainCamera";
        camera.transform.position=new Vector3(4,3.1f,4.5f); camera.transform.LookAt(new Vector3(0,1,0));
        camera.orthographic=true; camera.orthographicSize=2.7f;
        camera.clearFlags=CameraClearFlags.SolidColor; camera.backgroundColor=new Color(.035f,.052f,.06f);
        QualitySettings.vSyncCount=1; Application.targetFrameRate=60;
        Directory.CreateDirectory("Assets/Scenes");
        EditorSceneManager.SaveScene(scene,"Assets/Scenes/PunkinMotion.unity");
        EditorBuildSettings.scenes=new[]{new EditorBuildSettingsScene("Assets/Scenes/PunkinMotion.unity",true)};
        AssetDatabase.SaveAssets();
        File.WriteAllText("Punkin-unity-check.txt","PASS: imported FBX; "+joints.Length+" moving leg segments; clip seconds="+clip.length+
            "; rotation ranges="+string.Join(",",changes)+"; scene saved. Visual gait review still required.");
        Debug.Log("PUNKIN_UNITY_PASS: model, materials, animation, 12 moving leg segments and scene saved.");
    }
}
