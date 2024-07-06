export const MenuList = [
  {
    pageValue: 1,
    pageLink: "/",
    tooltip: "Accueil",
    icon: (
      <svg className="h-6 w-6" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" />
        <polyline points="5 12 3 12 12 3 21 12 19 12" />
        <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
        <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
      </svg>
    ),
  },
  {
    pageValue: 2,
    pageLink: "/client-file",
    tooltip: "Dossiers Client",
    icon: (
      <svg className="h-6 w-6" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 5v4a1 1 0 0 0 1 1h4 M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2 -2v-7l-5 -5h-11a2 2 0 0 0 -2 2z" />
      </svg>
    ),
  },
  {
    pageValue: 3,
    pageLink: "/products",
    tooltip: "Produits",
    icon: (
      <svg className="h-6 w-6" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="7" cy="15" r="4" />
        <line x1="7" y1="15" x2="7" y2="15.01" />
        <circle cx="19" cy="17" r="2" />
        <path d="M10.5 17h6.5 M20 15.2v-4.2a1 1 0 0 0 -1 -1h-6l-2 -5h-6v6.5 M18 5h-1a1 1 0 0 0 -1 1v4" />
      </svg>
    ),
  },
  {
    pageValue: 4,
    pageLink: "/clients",
    tooltip: "Clients",
    icon: (
      <svg className="h-6 w-6" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0 -4 -4h-3a4 4 0 0 0 -4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    pageValue: 5,
    pageLink: "/suppliers",
    tooltip: "Fournisseurs",
    icon: (
      <svg className="h-6 w-6" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 8h10l-1 9h-8z" />
        <path d="M7 8v-2a1 1 0 0 1 1 -1h2 M16 8v-2a1 1 0 0 0 -1 -1h-2" />
        <path d="M12 17v4" />
        <path d="M8 21h8" />
      </svg>
    ),
  },
  {
    pageValue: 6,
    pageLink: "/users",
    tooltip: "Utilisateurs",
    icon: (
      <svg className="h-6 w-6" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 12h3v6h-3z M14 12h3v6h-3z" />
        <path d="M10 6h4v3h-4z" />
      </svg>
    ),
  },
  {
    pageValue: 7,
    pageLink: "/categories",
    tooltip: "Categories",
    icon: (
      <svg className="h-6 w-6" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l2 3h-4l2 -3z" />
        <path d="M3 21v-1a4 4 0 0 1 4 -4h2a4 4 0 0 1 4 4v1" />
        <path d="M16 19h6m-3 -3v6" />
      </svg>
    ),
  },
  {
    pageValue: 8,
    pageLink: "/stats",
    tooltip: "Statistiques",
    icon: (
      <svg className="h-6 w-6" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="M9 16v-5 M13 16v-9 M17 16v-3" />
      </svg>
    ),
  },
  {
    pageValue: 9,
    pageLink: '/mails',
    tooltip: "Mails",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
      </svg>
    )
  },
  {
    pageValue: 10,
    pageLink: "/settings",
    tooltip: "Parametres",
    icon: (
      <svg className="h-6 w-6" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="2" />
        <path d="M19.4 15a1.1 1.1 0 0 0 .2 1.6l1.1 1.1a1.1 1.1 0 0 1 0 1.6l-1.4 1.4a1.1 1.1 0 0 1 -1.6 0l-1.1 -1.1a1.1 1.1 0 0 0 -1.6 -.2a8 8 0 0 1 -1.6 .9v1.4a1.1 1.1 0 0 1 -1.1 1.1h-2a1.1 1.1 0 0 1 -1.1 -1.1v-1.4a8 8 0 0 1 -1.6 -.9a1.1 1.1 0 0 0 -1.6 .2l-1.1 1.1a1.1 1.1 0 0 1 -1.6 0l-1.4 -1.4a1.1 1.1 0 0 1 0 -1.6l1.1 -1.1a1.1 1.1 0 0 0 .2 -1.6a8 8 0 0 1 -.9 -1.6h-1.4a1.1 1.1 0 0 1 -1.1 -1.1v-2a1.1 1.1 0 0 1 1.1 -1.1h1.4a8 8 0 0 1 .9 -1.6a1.1 1.1 0 0 0 -.2 -1.6l-1.1 -1.1a1.1 1.1 0 0 1 0 -1.6l1.4 -1.4a1.1 1.1 0 0 1 1.6 0l1.1 1.1a1.1 1.1 0 0 0 1.6 .2a8 8 0 0 1 1.6 -.9v-1.4a1.1 1.1 0 0 1 1.1 -1.1h2a1.1 1.1 0 0 1 1.1 1.1v1.4a8 8 0 0 1 1.6 .9a1.1 1.1 0 0 0 1.6 -.2l1.1 -1.1a1.1 1.1 0 0 1 1.6 0l1.4 1.4a1.1 1.1 0 0 1 0 1.6l-1.1 1.1a1.1 1.1 0 0 0 -.2 1.6a8 8 0 0 1 .9 1.6h1.4a1.1 1.1 0 0 1 1.1 1.1v2a1.1 1.1 0 0 1 -1.1 1.1h-1.4a8 8 0 0 1 -.9 1.6z" />
      </svg>
    ),
  },
];
