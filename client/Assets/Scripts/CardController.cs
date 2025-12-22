using UnityEngine;
using System.Collections;

namespace MirrorMind.Core
{
    public class CardController : MonoBehaviour
    {
        public enum CardState { Idle, Selected, Presenting, Reflecting, Flipping, Revealed, Completed }
        
        [Header("Settings")]
        public float flipSpeed = 0.62f;
        public AnimationCurve flipEase = AnimationCurve.EaseInOut(0, 0, 1, 1);
        
        private CardState currentState = CardState.Idle;
        private bool isFlipped = false;
        private Quaternion targetRotation;

        public void OnSelected()
        {
            if (currentState != CardState.Idle) return;
            // Trigger emergence animation
            StartCoroutine(TransitionToState(CardState.Selected));
        }

        public void Flip()
        {
            if (currentState != CardState.Presenting && currentState != CardState.Reflecting) return;
            StartCoroutine(FlipRoutine());
        }

        private IEnumerator FlipRoutine()
        {
            currentState = CardState.Flipping;
            Quaternion startRot = transform.localRotation;
            Quaternion endRot = startRot * Quaternion.Euler(0, 180, 0);
            
            float elapsed = 0;
            while (elapsed < flipSpeed)
            {
                float t = flipEase.Evaluate(elapsed / flipSpeed);
                transform.localRotation = Quaternion.Slerp(startRot, endRot, t);
                elapsed += Time.deltaTime;
                yield return null;
            }
            
            transform.localRotation = endRot;
            isFlipped = !isFlipped;
            currentState = isFlipped ? CardState.Revealed : CardState.Presenting;
        }

        private IEnumerator TransitionToState(CardState newState)
        {
            currentState = newState;
            yield return null;
            // Logic for state transitions (Visual/Audio cues)
        }
    }
}
