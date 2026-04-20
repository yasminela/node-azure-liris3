import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser, faUsers, faUserPlus, faUserEdit, faUserMinus, faGlobe,
  faFolder, faFolderOpen, faFile, faFileUpload, faFileDownload,
  faTrash, faTrashAlt, faEdit, faPlusCircle, faMinusCircle,
  faCheck, faCheckCircle, faTimes, faTimesCircle,
  faExclamationCircle, faExclamationTriangle, faInfoCircle,
  faBell, faBellSlash, faEnvelope, faEnvelopeOpen,
  faCalendar, faCalendarAlt, faClock, faChartBar, faChartLine,
  faHome, faCog, faTachometerAlt, faBriefcase, faRocket,
  faLightbulb, faCalculator, faPaintbrush, faTrophy, faBullseye,
  faLock, faUnlock, faEye, faEyeSlash, faPaperPlane,
  faUpload, faDownload, faSync, faSpinner, faSearch,
  faFilter, faAngleLeft, faAngleRight, faChevronLeft, faChevronRight,
  faArrowLeft, faArrowRight, faSignOutAlt, faSignInAlt,
  faHeart, faMapMarkerAlt, faPhone, faCommentDots,
  faSave, faCopy, faClipboard, faMoneyBill, faCreditCard,
  faGraduationCap, faBusinessTime, faUsers as faUsersSolid,
  faClipboardList, faTasks
} from '@fortawesome/free-solid-svg-icons';

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
  users: faUsersSolid,
  users_alt: faUsersSolid,
  person: faUser,
  group: faUsersSolid,
  globe: faGlobe,
  user_add: faUserPlus,
  user_edit: faUserEdit,
  user_delete: faUserMinus,
  
  // Fichiers et dossiers
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
  target: faBullseye,
  lock: faLock,
  unlock: faUnlock,
  development: faChartLine,
  learning: faGraduationCap,
  startups: faRocket,
  collab: faUsersSolid,
  collab_n: faUsersSolid,
  
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
  
  // Autres
  heart: faHeart,
  marker: faMapMarkerAlt,
  logout: faSignOutAlt,
  login: faSignInAlt,
  search: faSearch,
  filter: faFilter,
  award: faTrophy, 

  // Tâches
  task_checklist: faCheckCircle,
  assignment: faClipboardList,
  waiting_assignment: faClock,
  
  // Finance
  budget: faMoneyBill,
  payments: faCreditCard
};

function Icon({ name, size = 24, color = "currentColor", className = "", style = {} }) {
  const icon = iconMap[name];
  
  if (!icon) {
    console.warn(`Icon "${name}" not found`);
    return <span style={{ fontSize: size, color }}></span>;
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