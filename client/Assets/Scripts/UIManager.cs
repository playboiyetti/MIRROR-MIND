using UnityEngine;
using TMPro;
using UnityEngine.UI;

namespace MirrorMind.Core
{
    public class UIManager : MonoBehaviour
    {
        [Header("Reflection UI")]
        public TextMeshProUGUI categoryTitleHeader;
        public TextMeshProUGUI questionTextDisplay;
        public TMP_InputField reflectionInputField;
        public Button saveButton;

        public void UpdateDisplay(string category, string question)
        {
            categoryTitleHeader.text = category.ToUpper();
            questionTextDisplay.text = question;
            reflectionInputField.text = "";
        }

        public void OnSavePressed()
        {
            string reflection = reflectionInputField.text;
            Debug.Log($"Reflection Saved: {reflection}");
            // Sync with backend API logic
        }
    }
}
