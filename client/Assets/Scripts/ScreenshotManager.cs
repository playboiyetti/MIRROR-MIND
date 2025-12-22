using UnityEngine;
using System.IO;

namespace MirrorMind.Social
{
    public class ScreenshotManager : MonoBehaviour
    {
        [Header("Capture Settings")]
        public string fileNamePrefix = "MirrorMind_Reflection";
        public Vector2Int captureResolution = new Vector2Int(1080, 1920);

        public void CaptureAndShare()
        {
            string fileName = $"{fileNamePrefix}_{System.DateTime.Now:yyyyMMdd_HHmmss}.png";
            string filePath = Path.Combine(Application.persistentDataPath, fileName);

            // Hide UI elements if necessary before capture
            // UIManager.Instance.SetUIVisible(false);

            ScreenCapture.CaptureScreenshot(fileName);
            
            Debug.Log($"Screenshot saved to: {filePath}");
            
            // In a production environment, use a native plugin to trigger the OS share sheet
            // Example: NativeShare.Share(filePath);
        }

        // Advanced: Render to Texture for specific "Clay Border" framing
        public void CaptureWithFrame()
        {
            RenderTexture rt = new RenderTexture(captureResolution.x, captureResolution.y, 24);
            Camera.main.targetTexture = rt;
            Texture2D screenShot = new Texture2D(captureResolution.x, captureResolution.y, TextureFormat.RGB24, false);
            Camera.main.Render();
            RenderTexture.active = rt;
            screenShot.ReadPixels(new Rect(0, 0, captureResolution.x, captureResolution.y), 0, 0);
            Camera.main.targetTexture = null;
            RenderTexture.active = null;
            Destroy(rt);

            byte[] bytes = screenShot.EncodeToPNG();
            string fileName = $"{fileNamePrefix}_Framed_{System.DateTime.Now:yyyyMMdd_HHmmss}.png";
            File.WriteAllBytes(Path.Combine(Application.persistentDataPath, fileName), bytes);
            
            Debug.Log("Framed screenshot captured via RenderToTexture.");
        }
    }
}
