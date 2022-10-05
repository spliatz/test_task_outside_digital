export interface IGetTagById {
    creator: {
        nickname: string;
        uid: string;
    };
    name: string;
    sortOrder: number;
}

export interface IGetTags {
    data: Awaited<IGetTagById>[];
    meta: {
    sortByOrder: number;
    quantity: number;
    length: number;
    page: number
  }
}

