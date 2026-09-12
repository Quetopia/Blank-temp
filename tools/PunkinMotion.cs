using UnityEngine;

// Motion study: arrow keys/WASD to steer, Space to pause, Tab for orbit demo.
// Smooth velocity and continuous quaternion rotation replace sprite facings.
public sealed class PunkinMotion : MonoBehaviour
{
    public Animation walk;
    public string clipName;
    public bool orbit = true;
    public float speed = .34375f; // .44m planted travel / (2s cycle * .64 stance)
    Vector3 velocity;
    bool paused;
    float phase;
    bool captured;

    void Update()
    {
        if (!captured && Time.time > 4)
        {
            captured=true;
            ScreenCapture.CaptureScreenshot(System.IO.Path.Combine(Application.dataPath,"../Punkin-runtime.png"));
            Debug.Log("PUNKIN_RUNTIME_CAPTURE: animation=" + (walk != null && walk.isPlaying));
        }
        float dt = Mathf.Min(Time.deltaTime, .05f);
        if (Input.GetKeyDown(KeyCode.Space)) paused = !paused;
        if (Input.GetKeyDown(KeyCode.Tab)) orbit = !orbit;
        Vector3 requested = Vector3.zero;
        if (!paused)
        {
            requested.x = (Input.GetKey(KeyCode.D) || Input.GetKey(KeyCode.RightArrow) ? 1 : 0)
                - (Input.GetKey(KeyCode.A) || Input.GetKey(KeyCode.LeftArrow) ? 1 : 0);
            requested.z = (Input.GetKey(KeyCode.W) || Input.GetKey(KeyCode.UpArrow) ? 1 : 0)
                - (Input.GetKey(KeyCode.S) || Input.GetKey(KeyCode.DownArrow) ? 1 : 0);
            if (requested.sqrMagnitude > 0) orbit = false;
            if (orbit)
            {
                phase += dt * speed / .6f;
                requested = new Vector3(Mathf.Cos(phase), 0, -Mathf.Sin(phase));
            }
        }
        velocity = Vector3.Lerp(velocity, requested.normalized * speed, 1-Mathf.Exp(-7*dt));
        if (velocity.sqrMagnitude > .00001f)
        {
            transform.rotation = Quaternion.Slerp(transform.rotation,
                Quaternion.LookRotation(velocity), 1-Mathf.Exp(-9*dt));
            transform.position += velocity*dt;
        }
        if (walk != null && walk[clipName] != null)
            walk[clipName].speed = velocity.magnitude / speed;
    }

    void OnGUI()
    {
        GUI.color = new Color(.91f,.91f,.80f);
        GUI.Label(new Rect(24,20,650,30), "PUNKIN / 3D MOTION STUDY");
        GUI.Label(new Rect(24,48,760,30), "WASD / arrows: steer    Space: pause    Tab: circle walk");
        GUI.Label(new Rect(24,76,760,30), "Prototype model • full skeletal legs • continuous turning");
    }
}
