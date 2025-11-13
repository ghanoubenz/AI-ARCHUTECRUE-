// FIX: Import `Modality` for use in image generation config.
import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { Scene } from "../types";

// FIX: Removed getApiKey() function to use process.env.API_KEY directly as per guidelines.

const sceneSchema = {
    type: Type.OBJECT,
    properties: {
        units: { type: Type.STRING, enum: ['m'] },
        plot: {
            type: Type.OBJECT,
            properties: {
                shape: { type: Type.STRING, enum: ['L', 'Rect'] },
                bounds: { type: Type.OBJECT, properties: { w: { type: Type.NUMBER }, h: { type: Type.NUMBER } } },
                mask: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { x: { type: Type.NUMBER }, y: { type: Type.NUMBER }, w: { type: Type.NUMBER }, h: { type: Type.NUMBER } } } },
            }
        },
        offices: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING },
                    x: { type: Type.NUMBER }, y: { type: Type.NUMBER }, w: { type: Type.NUMBER }, h: { type: Type.NUMBER },
                    material: { type: Type.STRING, enum: ['concrete', 'steel', 'container'] },
                    color: { type: Type.STRING, description: "Hex color code, e.g., #FF0000" },
                }
            }
        },
        courtyard: {
            type: Type.OBJECT,
            properties: {
                x: { type: Type.NUMBER }, y: { type: Type.NUMBER }, w: { type: Type.NUMBER }, h: { type: Type.NUMBER },
                fountain: { type: Type.BOOLEAN },
            }
        },
        warehouse: {
            type: Type.OBJECT,
            properties: {
                id: { type: Type.STRING },
                x: { type: Type.NUMBER }, y: { type: Type.NUMBER }, w: { type: Type.NUMBER }, h: { type: Type.NUMBER },
                material: { type: Type.STRING, enum: ['steel', 'concrete'] },
                wallColor: { type: Type.STRING },
                roofColor: { type: Type.STRING },
                roof: { type: Type.OBJECT, properties: { type: { type: Type.STRING, enum: ['pitched', 'flat'] }, skylights: { type: Type.INTEGER } } }
            }
        },
        roads: {
            type: Type.OBJECT,
            properties: {
                northEntrance: { type: Type.OBJECT, properties: { x: { type: Type.NUMBER }, y: { type: Type.NUMBER }, parking: { type: Type.OBJECT, properties: { slots: { type: Type.INTEGER } } } } },
                east: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { x: { type: Type.NUMBER }, y: { type: Type.NUMBER } } } },
                west_turnaround_path: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { x: { type: Type.NUMBER }, y: { type: Type.NUMBER } } } },
                width: { type: Type.NUMBER },
            }
        },
        landscape: {
            type: Type.OBJECT,
            properties: {
                perimeter: { type: Type.ARRAY, items: { type: Type.STRING, enum: ['N', 'W', 'S', 'E'] } },
                treeSpacing: { type: Type.NUMBER },
            }
        },
        structureLock: { type: Type.BOOLEAN },
        overrides: {
            type: Type.OBJECT,
            properties: {
                warehouseMesh: { type: Type.STRING },
                officeMesh: { type: Type.STRING },
            }
        }
    },
};


export const updateSceneFromPrompt = async (prompt: string, currentScene: Scene): Promise<Scene> => {
    // FIX: Initialize with API key directly from process.env.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const systemInstruction = `You are an AI assistant for an architectural visualization tool. Your task is to process a user's natural language request to modify a scene described in a JSON object.
Your response MUST be ONLY the updated, complete JSON object of the entire scene, conforming to the provided schema.
Do NOT add any text, explanations, or markdown formatting.
If the request is ambiguous or impossible, make a reasonable interpretation but do not change the fundamental layout without explicit instruction.
All coordinates and dimensions are in meters. The origin (0,0) is the top-left corner of the plot.
CRITICAL RULE: The 'structureLock' is currently ${currentScene.structureLock ? 'ON' : 'OFF'}.
- If 'structureLock' is ON, you are FORBIDDEN from changing the x/y coordinates of any element (offices, warehouse, courtyard, roads). You are only allowed to change properties like materials, colors, dimensions (w,h), counts (skylights, parking slots), or spacing.
- If the user asks to 'move' or 'relayout' an element while the lock is on, do not perform the change; instead, change only the 'structureLock' property to 'false' in the returned JSON and nothing else.
- If 'structureLock' is OFF, you are allowed to change x/y coordinates.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: `Based on the current scene JSON, apply the following change: "${prompt}".\n\nCurrent Scene:\n${JSON.stringify(currentScene, null, 2)}`,
        config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: sceneSchema as any,
            thinkingConfig: { thinkingBudget: 32768 },
        },
    });

    try {
        const text = response.text.trim();
        const newScene = JSON.parse(text) as Scene;
        // Basic validation
        if (newScene.plot && newScene.offices && newScene.warehouse) {
            return newScene;
        }
        throw new Error("Parsed JSON is missing key properties.");
    } catch (e) {
        console.error("Failed to parse Gemini response:", e);
        console.error("Raw response text:", response.text);
        throw new Error("Received invalid JSON from the model.");
    }
};

export const generateImageRendering = async (sceneData: Scene): Promise<string> => {
    // FIX: Initialize with API key directly from process.env.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const officeDescriptions = sceneData.offices.map(o => `a ${o.w}x${o.h}m ${o.material} office block colored ${o.color}`).join(' and ');
    const warehouseDesc = `a ${sceneData.warehouse.w}x${sceneData.warehouse.h}m ${sceneData.warehouse.material} warehouse with a ${sceneData.warehouse.roof.type} roof.`;
    const prompt = `Photorealistic, high-detail architectural rendering of a modern industrial site. The scene includes: ${officeDescriptions}, and ${warehouseDesc}. The style is a sunny day, 4K, professional photograph.`;
    
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: '16:9',
        },
    });

    const base64ImageBytes = response.generatedImages[0].image.imageBytes;
    return `data:image/jpeg;base64,${base64ImageBytes}`;
};

export const editImageWithPrompt = async (base64ImageData: string, prompt: string): Promise<string> => {
    // FIX: Initialize with API key directly from process.env.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                { inlineData: { data: base64ImageData.split(',')[1], mimeType: 'image/jpeg' } },
                { text: prompt },
            ],
        },
        config: {
            // FIX: Use Modality.IMAGE enum instead of string literal 'IMAGE'.
            responseModalities: [Modality.IMAGE],
        },
    });

    const part = response.candidates?.[0]?.content?.parts?.[0];
    if (part?.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
    }
    throw new Error("Could not edit image.");
};

export const generateVideoFlythrough = async (sceneData: Scene, aspectRatio: '16:9' | '9:16'): Promise<string> => {
    // FIX: Initialize with API key directly from process.env.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `A cinematic, smooth drone fly-through of a modern industrial architectural site. Show the details of the buildings: ${sceneData.offices.map(o => o.material + ' office').join(', ')} and the ${sceneData.warehouse.material} warehouse.`;

    let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: {
            numberOfVideos: 1,
            resolution: '720p',
            aspectRatio: aspectRatio
        }
    });

    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    if(operation.error) {
        throw new Error(`Video generation failed: ${operation.error.message}`);
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
        throw new Error("Video generation completed but no download link was found.");
    }

    // FIX: Use API key directly from process.env for fetching video.
    const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    if (!videoResponse.ok) {
        throw new Error("Failed to download the generated video.");
    }
    const videoBlob = await videoResponse.blob();
    return URL.createObjectURL(videoBlob);
};