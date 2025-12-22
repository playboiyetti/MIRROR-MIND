using UnityEngine;
using System.Collections.Generic;

namespace MirrorMind.Core
{
    public class DataProvider : MonoBehaviour
    {
        public bool useMockData = true;

        public string GetCategoryData(string categoryId)
        {
            TextAsset jsonFile = Resources.Load<TextAsset>($"Categories/{categoryId}");
            if (jsonFile != null) return jsonFile.text;
            return null;
        }

        public string GetQuestionsData(string categoryId)
        {
            TextAsset jsonFile = Resources.Load<TextAsset>($"Questions/{categoryId}");
            if (jsonFile != null) return jsonFile.text;
            return null;
        }
    }
}
