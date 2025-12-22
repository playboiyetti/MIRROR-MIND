using UnityEngine;
using UnityEngine.Rendering;
using UnityEngine.Rendering.Universal;

namespace MirrorMind.Core
{
    /// <summary>
    /// Programmatically ensures URP settings are optimized for the Luxury Dark aesthetic.
    /// </summary>
    public class URPConfigHelper : MonoBehaviour
    {
        public UniversalRenderPipelineAsset urpAsset;

        void Start()
        {
            if (urpAsset == null)
            {
                urpAsset = GraphicsSettings.currentRenderPipeline as UniversalRenderPipelineAsset;
            }

            if (urpAsset != null)
            {
                ConfigureQuality();
            }
        }

        private void ConfigureQuality()
        {
            // Force high-quality settings for premium look irrespective of device defaults
            urpAsset.shadowDistance = 50f;
            urpAsset.renderScale = 1.2f; // Slight supersampling for crispness
            urpAsset.upscalingFilter = UpscalingFilterSelection.FSR;
            
            Debug.Log("URP Configured for Luxury Dark Aesthetic: RenderScale 1.2, FSR Enabled.");
        }

        // Methods to toggle Post-processing effects programmatically for intensity levels
        public void SetIntensityVisuals(int level)
        {
            // Logic to adjust Bloom, Vignette, and Color Grading based on question depth
            Debug.Log($"Adjusting URP Post-processing for Intensity Level: {level}");
        }
    }
}
