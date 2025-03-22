import { KEYBOARD_KEYS } from "./constants";
import { COLORS } from "./constants";
import { pieceImagesRainbowFriends } from "./constants"
import { pieceImagesRainbowFriendsBig } from "./constants";


// Draw Functions

// function to create rectangular base canvas
export const createMatrix = (w, h) => {
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}