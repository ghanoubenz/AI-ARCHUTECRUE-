import { useTexture } from '@react-three/drei';
// Fix: Import THREE to use its types and constants.
import * as THREE from 'three';

// In a real app, these would be higher quality textures.
// Using data URLs to keep it self-contained.
const textures = {
    'Standard Wall': 'https://aistudio.google.com/static/meet_gemini/textures/concrete.jpg',
    'Steel Structure': 'https://aistudio.google.com/static/meet_gemini/textures/metal.jpg',
    'Shipping Container': 'https://aistudio.google.com/static/meet_gemini/textures/container.jpg'
};

export const useTextures = () => {
    const loadedTextures = useTexture(textures);
    // Configure textures
    Object.values(loadedTextures).forEach(texture => {
        // Fix: Cast texture to THREE.Texture to access its properties.
        // The type of `texture` is inferred as `unknown` from `Object.values`.
        const t = texture as THREE.Texture;
        t.wrapS = t.wrapT = THREE.RepeatWrapping;
        t.repeat.set(1, 1);
    });
    return loadedTextures;
};
