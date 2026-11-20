export type Photo = {
  src: string;
  width: number;
  height: number;
};

export type Memory = {
  id: string;
  photos: Photo[];
};

export type BirthdayContent = {
  name: string;
  memories: Memory[];
};

export type PhotoManifest = Record<
  string,
  {
    file: string;
    width: number;
    height: number;
  }[]
>;
