type UserAPIRole = "CUSTOMER" | "ADMIN" | "TECHNICIAN";

type User = {
  avatar?: string;
  email?: string;
  id?: string;
  name: string;
  role?: string;
  password?: string;
  old_password?: string;
  schedule?: string[];
};

type UserAPIResponse = {
  token: string;
  user: {
    avatar?: string;
    email: string;
    id: string;
    name: string;
    role: string;
    schedule?: string[];
  };
};
