using UnityEngine;

namespace MirrorMind.Core
{
    [RequireComponent(typeof(Rigidbody))]
    public class CardPhysics : MonoBehaviour
    {
        [Header("Physics Settings")]
        public float springForce = 150f;
        public float damping = 10f;
        public float rotationLerpSpeed = 8f;
        
        [Header("Claymation Easing")]
        public float bounceScale = 1.05f;
        public float bounceDuration = 0.4f;

        private Rigidbody rb;
        private Vector3 targetPosition;
        private Quaternion targetRotation;
        private Vector3 originalScale;

        void Awake()
        {
            rb = GetComponent<Rigidbody>();
            rb.useGravity = false;
            rb.drag = damping;
            originalScale = transform.localScale;
        }

        public void SetTarget(Vector3 position, Quaternion rotation)
        {
            targetPosition = position;
            targetRotation = rotation;
            ApplyClayBounce();
        }

        void FixedUpdate()
        {
            // Spring-like positioning for "squishy" movement
            Vector3 force = (targetPosition - transform.position) * springForce;
            rb.AddForce(force);

            // Smooth rotation alignment
            transform.rotation = Quaternion.Slerp(transform.rotation, targetRotation, Time.fixedDeltaTime * rotationLerpSpeed);
        }

        private void ApplyClayBounce()
        {
            // Simple visual "stretch and squash" for clay feel
            LeanTween.scale(gameObject, originalScale * bounceScale, bounceDuration * 0.5f)
                .setEase(LeanTweenType.easeOutQuad)
                .setOnComplete(() => {
                    LeanTween.scale(gameObject, originalScale, bounceDuration * 0.5f).setEase(LeanTweenType.easeInQuad);
                });
        }
    }
}
