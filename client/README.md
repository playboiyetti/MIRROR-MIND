# Mirror Mind 2.0 - Unity Client

This directory contains the Unity 2023.2 LTS project for Mirror Mind 2.0.

## Project Specifications
- **Engine**: Unity 2023.2 LTS
- **Render Pipeline**: Universal Render Pipeline (URP)
- **Target Frame Rate**: 60 FPS
- **Architecture**: ARM64 (Mobile Priority)

## Folder Structure
- `/Assets/Scripts`: C# Logic and Systems
- `/Assets/Prefabs`: Reusable UI and 3D Elements
- `/Assets/Scenes`: Screen definitions (Menu, Reflection, Evolution)
- `/Assets/Resources`: Dynamic content and configuration
- `/Assets/Shaders`: Custom Claytonmation/Glassmorphism shaders

## Initial Systems
The project is initialized with the following foundational scripts:
1. `CardController.cs`: Handles 3D rotation and state management.
2. `DeckManager.cs`: Manages card spawning and category loading.
3. `UIManager.cs`: Bridges Unity UI with the psychological data layer.
