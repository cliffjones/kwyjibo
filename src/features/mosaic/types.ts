import { Dispatch, SetStateAction } from 'react';

export type ActivePointer = { id: number; type: string; tileKey: string | null };
export type SetHoveredTile = Dispatch<SetStateAction<string | null>>;
