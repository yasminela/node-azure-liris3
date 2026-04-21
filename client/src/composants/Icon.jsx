import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  // Utilisateurs
  faUser, faUsers, faUserPlus, faUserEdit, faUserMinus,
  // Fichiers
  faFolder, faFolderOpen, faFile, faFileUpload, faFileDownload,
  // Actions
  faTrash, faTrashAlt, faEdit, faPlusCircle, faMinusCircle,
  faCheck, faCheckCircle, faTimes, faTimesCircle,
  faExclamationCircle, faExclamationTriangle, faInfoCircle,
  faBell, faBellSlash, faEnvelope, faEnvelopeOpen,
  // Calendrier & Temps
  faCalendar, faCalendarAlt, faClock,
  // Graphiques
  faChartBar, faChartLine,
  // Navigation
  faHome, faCog, faTachometerAlt, faBriefcase, faRocket,
  faLightbulb, faCalculator, faPaintbrush, faTrophy, faBullseye,
  faLock, faUnlock, faEye, faEyeSlash, faPaperPlane,
  faUpload, faDownload, faSync, faSpinner, faSearch,
  faFilter, faAngleLeft, faAngleRight, faChevronLeft, faChevronRight,
  faArrowLeft, faArrowRight, faSignOutAlt, faSignInAlt,
  faHeart, faMapMarkerAlt, faPhone, faCommentDots,
  faSave, faCopy, faClipboard, faMoneyBill, faCreditCard,
  faGraduationCap, faBusinessTime, faGlobe, faNetworkWired
} from '@fortawesome/free-solid-svg-icons';

// Brand icons (réseaux sociaux)
import {
  faLinkedin,
  faTwitter,
  faFacebook,
  faInstagram,
  faGithub
} from '@fortawesome/free-brands-svg-icons';

// Regular icons
import {
  faBell as farBell,
  faEnvelope as farEnvelope,
  faCalendar as farCalendar,
  faClock as farClock,
  faHeart as farHeart,
  faUser as farUser,
  faFolder as farFolder,
  faFile as farFile,
  faCheckCircle as farCheckCircle
} from '@fortawesome/free-regular-svg-icons';

const iconMap = {
  // Utilisateurs
  user: faUser,
  users: faUsers,
  users_alt: faUsers,
  person: faUser,
  group: faUsers,
  user_add: faUserPlus,
  user_edit: faUserEdit,
  user_delete: faUserMinus,
  logout: faSignOutAlt,

  
  // Fichiers
  folder: faFolder,
  folder_open: faFolderOpen,
  file: faFile,
  document: faFile,
  upload_file: faFileUpload,
  delete_file: faTrashAlt,
  
  // Actions
  delete: faTrash,
  edit: faEdit,
  add_circle: faPlusCircle,
  check: faCheck,
  check_circle: faCheckCircle,
  check_st: faCheckCircle,
  validate: faCheckCircle,
  reject: faTimesCircle,
  pending: faClock,
  send: faPaperPlane,
  upload: faUpload,
  download: faDownload,
  refresh: faSync,
  save: faSave,
  copy: faCopy,
  
  // Navigation
  home: faHome,
  settings: faCog,
  dashboard_panel: faTachometerAlt,
  business: faBusinessTime,
  work: faBriefcase,
  angle_left: faAngleLeft,
  angle_right: faAngleRight,
  
  // Programme Early Stage
  rocket: faRocket,
  lightbulb: faLightbulb,
  calculator: faCalculator,
  brush: faPaintbrush,
  trophy: faTrophy,
  award: faTrophy,  // ✅ Ajout de award comme alias
  target: faBullseye,
  lock: faLock,
  unlock: faUnlock,
  development: faChartLine,
  learning: faGraduationCap,
  startups: faRocket,
  collab: faUsers,
  collab_n: faUsers,
  
  // Notifications
  notification: faBell,
  notification_bell_ranging: faBell,
  no_notification: faBellSlash,
  comment_info: faCommentDots,
  
  // Calendrier
  calendar: faCalendarAlt,
  calendar_ar_bold: faCalendarAlt,
  calendar_av_en: faCalendar,
  event: faCalendarAlt,
  today: faCalendarAlt,
  duration: faClock,
  
  // Communication
  email: faEnvelope,
  email_open: faEnvelopeOpen,
  call: faPhone,
  phone: faPhone,
  
  // Visibilité
  visible: faEye,
  not_visible: faEyeSlash,
  
  // Statuts
  success: faCheckCircle,
  error: faTimesCircle,
  info: faInfoCircle,
  warning: faExclamationTriangle,
  exclamation: faExclamationCircle,
  exclamation_point: faExclamationCircle,
  verified: faCheckCircle,
  
  // Graphiques
  bar_chart: faChartBar,
  chart: faChartBar,
  
  // Réseaux
  network: faNetworkWired,
  globe: faGlobe,
  
  // Réseaux sociaux (brands)
  linkedin: faLinkedin,
  twitter: faTwitter,
  facebook: faFacebook,
  instagram: faInstagram,
  github: faGithub,
  
  // Autres
  heart: faHeart,
  marker: faMapMarkerAlt,
  login: faSignInAlt,
  search: faSearch,
  filter: faFilter,
  
  // Tâches
  task_checklist: faCheckCircle,
  assignment: faClipboard,
  waiting_assignment: faClock,
  
  // Finance
  budget: faMoneyBill,
  payments: faCreditCard
};

function Icon({ name, size = 24, color = "currentColor", className = "", style = {} }) {
  const icon = iconMap[name];
  
  if (!icon) {
    console.warn(`Icon "${name}" not found`);
    return <span style={{ fontSize: size, color }}>🔍</span>;
  }
  
  return (
    <FontAwesomeIcon 
      icon={icon} 
      style={{ fontSize: size, color, ...style }}
      className={className}
    />
  );
}

export default Icon;