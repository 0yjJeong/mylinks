export type ListRaw = {
  id: string;
  title: string;
  created_at: string;
};

export type LinkRaw = {
  id: string;
  list_id: string;
  url: string;
  title: string;
  image: string;
  description: string;
  created_at: string;
};
