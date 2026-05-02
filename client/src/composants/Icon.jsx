import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, faUsers, faUserPlus, faUserEdit, faUserMinus,
  faFolder, faFolderOpen, faFile, faFilePdf, faFileUpload, faFileDownload,
  faTrash, faTrashAlt, faEdit, faPlusCircle, faMinusCircle,
  faCheck, faCheckCircle, faTimes, faTimesCircle,
  faExclamationCircle, faExclamationTriangle, faInfoCircle,
  faBell, faBellSlash, faEnvelope, faEnvelopeOpen,
  faCalendar, faCalendarAlt, faClock,
  faChartBar, faChartLine, faChartPie,
  faHome, faCog, faTachometerAlt, faBriefcase, faRocket,
  faLightbulb, faCalculator, faPaintbrush, faTrophy, faBullseye,
  faLock, faUnlock, faEye, faEyeSlash, faPaperPlane,
  faUpload, faDownload, faSync, faSpinner, faSearch,
  faFilter, faAngleLeft, faAngleRight, faChevronLeft, faChevronRight,
  faArrowLeft, faArrowRight, faSignOutAlt, faSignInAlt,
  faHeart, faMapMarkerAlt, faPhone, faCommentDots,
  faSave, faCopy, faClipboard, faMoneyBill, faCreditCard,
  faGraduationCap, faBusinessTime, faGlobe, faNetworkWired,
  faHandshake, faCopyright, faCode, faBrain, faRobot,
  faTasks, faChartSimple, faBuilding, faEnvelope as faEnvelopeSolid,
  faCalendarWeek, faClock as faClockSolid, faArrowRight as faArrowRightSolid,
  faCheckDouble, faFileContract, faFileInvoice, faHistory,
  // Ajout des icônes manquantes
  faDashboard, faProjectDiagram, faTimeline, faClipboardList,
  faFileAlt, faUserCircle, faAddressCard, faIdCard,
  faStar, faStarHalfAlt, faThumbsUp, faThumbsDown
} from '@fortawesome/free-solid-svg-icons';

// Brand icons
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
  faCheckCircle as farCheckCircle,
  faStar as farStar
} from '@fortawesome/free-regular-svg-icons';

const iconMap = {
  // Utilisateurs et rôles
  user: faUser,
  users: faUsers,
  users_alt: faUsers,
  person: faUser,
  group: faUsers,
  user_add: faUserPlus,
  user_edit: faUserEdit,
  user_delete: faUserMinus,
  user_circle: faUserCircle,
  address_card: faAddressCard,
  id_card: faIdCard,
  
  // Dossiers et fichiers
  folder: faFolder,
  folder_open: faFolderOpen,
  file: faFile,
  file_pdf: faFilePdf,
  document: faFileAlt,
  file_alt: faFileAlt,
  upload_file: faFileUpload,
  delete_file: faTrashAlt,
  delete: faTrash,
  edit: faEdit,
  contract: faFileContract,
  invoice: faFileInvoice,
  
  // Actions
  add_circle: faPlusCircle,
  add: faPlusCircle,
  remove_circle: faMinusCircle,
  check: faCheck,
  check_circle: faCheckCircle,
  check_st: faCheckCircle,
  validate: faCheckCircle,
  check_double: faCheckDouble,
  reject: faTimesCircle,
  pending: faClock,
  send: faPaperPlane,
  upload: faUpload,
  download: faDownload,
  refresh: faSync,
  save: faSave,
  copy: faCopy,
  history: faHistory,
  
  // Navigation
  home: faHome,
  settings: faCog,
  dashboard: faTachometerAlt,
  dashboard_panel: faTachometerAlt,
  business: faBuilding,
  building: faBuilding,
  work: faBriefcase,
  project: faProjectDiagram,
  timeline: faTimeline,
  clipboard: faClipboardList,
  tasks: faTasks,
  assignment: faClipboard,
  task_checklist: faClipboardList,
  
  // Flèches
  angle_left: faAngleLeft,
  angle_right: faAngleRight,
  chevron_left: faChevronLeft,
  chevron_right: faChevronRight,
  arrow_left: faArrowLeft,
  arrow_right: faArrowRight,
  
  // Thème et programme
  rocket: faRocket,
  lightbulb: faLightbulb,
  calculator: faCalculator,
  brush: faPaintbrush,
  paintbrush: faPaintbrush,
  trophy: faTrophy,
  award: faTrophy,
  target: faBullseye,
  bullseye: faBullseye,
  star: faStar,
  star_half: faStarHalfAlt,
  thumbs_up: faThumbsUp,
  thumbs_down: faThumbsDown,
  
  // Sécurité
  lock: faLock,
  unlock: faUnlock,
  visible: faEye,
  eye: faEye,
  not_visible: faEyeSlash,
  eye_slash: faEyeSlash,
  
  // Graphiques
  development: faChartLine,
  learning: faGraduationCap,
  startups: faRocket,
  collab: faUsers,
  collab_n: faUsers,
  chart: faChartSimple,
  chart_line: faChartLine,
  chart_bar: faChartBar,
  chart_pie: faChartPie,
  analytics: faChartSimple,
  stats: faChartBar,
  scores: faChartSimple,
  
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
  calendar_week: faCalendarWeek,
  duration: faClockSolid,
  
  // Communication
  email: faEnvelopeSolid,
  email_open: faEnvelopeOpen,
  call: faPhone,
  phone: faPhone,
  
  // Statuts
  success: faCheckCircle,
  error: faTimesCircle,
  info: faInfoCircle,
  warning: faExclamationTriangle,
  exclamation: faExclamationCircle,
  exclamation_point: faExclamationCircle,
  verified: faCheckCircle,
  
  // Réseaux sociaux
  linkedin: faLinkedin,
  twitter: faTwitter,
  facebook: faFacebook,
  instagram: faInstagram,
  github: faGithub,
  
  // Divers
  network: faNetworkWired,
  globe: faGlobe,
  heart: faHeart,
  marker: faMapMarkerAlt,
  logout: faSignOutAlt,
  login: faSignInAlt,
  search: faSearch,
  filter: faFilter,
  budget: faMoneyBill,
  payments: faCreditCard,
  handshake: faHandshake,
  copyright: faCopyright,
  code: faCode,
  brain: faBrain,
  robot: faRobot,
  
  // Icônes régulières (outline)
  far_bell: farBell,
  far_envelope: farEnvelope,
  far_calendar: farCalendar,
  far_clock: farClock,
  far_heart: farHeart,
  far_user: farUser,
  far_folder: farFolder,
  far_file: farFile,
  far_check_circle: farCheckCircle,
  far_star: farStar,
  
  // Icônes additionnelles
  light_mode: faLightbulb,
  dark_mode: faMoon,
  moon: faMoon,
  sun: faSun
};

// Ajout des icônes FontAwesome qui peuvent manquer
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

function Icon({ name, size = 20, color = "currentColor", className = "", style = {} }) {
  const icon = iconMap[name];
  
  if (!icon) {
    console.warn(`Icon "${name}" not found, using default`);
    // Retourner une icône par défaut au lieu d'un span
    return (
      <span 
        style={{ 
          fontSize: size, 
          color, 
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...style 
        }} 
        className={className}
      >
        🔍
      </span>
    );
  }
  
  return (
    <FontAwesomeIcon 
      icon={icon} 
      style={{ 
        fontSize: size, 
        color, 
        ...style 
      }} 
      className={className} 
    />
  );
}

export default Icon;