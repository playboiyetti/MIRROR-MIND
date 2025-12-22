using UnityEngine;
using System.Collections.Generic;
using System.Collections;

namespace MirrorMind.Core
{
    public class DeckManager : MonoBehaviour
    {
        [Header("References")]
        public GameObject cardPrefab;
        public Transform cardSpawnPoint;
        
        [Header("State")]
        public string currentCategoryId;
        private List<string> questionBuffer = new List<string>();

        public void LoadCategory(string categoryId)
        {
            currentCategoryId = categoryId;
            // Logic to fetch questions from the API or local Resources
            Debug.Log($"Loading category: {categoryId}");
            SpawnNextCard();
        }

        public void SpawnNextCard()
        {
            if (cardPrefab != null && cardSpawnPoint != null)
            {
                GameObject newCard = Instantiate(cardPrefab, cardSpawnPoint.position, cardSpawnPoint.rotation);
                // Initialize card data from buffer
            }
        }
    }
}
