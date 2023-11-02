type NavItem = {
  label: string;
  subLabel?: string;
  subItems?: NavItem[];
  href?: string;
};

export type { NavItem };
