import { OG_FACE_CHUNK_1 } from './og-face-1';
import { OG_FACE_CHUNK_2 } from './og-face-2';
import { OG_FACE_CHUNK_3 } from './og-face-3';

// Tito face mark for the OG image renderer: the locked-avatar crop as a PNG
// data URI (the OG renderer's image pipeline does not decode WebP). The face
// was cropped and masked only, never regenerated.
export const LOGO_FACE_OG_DATA_URI =
  'data:image/png;base64,' + OG_FACE_CHUNK_1 + OG_FACE_CHUNK_2 + OG_FACE_CHUNK_3;
