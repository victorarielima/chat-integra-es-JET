import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faRobot, faLightbulb } from '@fortawesome/free-solid-svg-icons';

export const IntegrationIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <FontAwesomeIcon 
    icon={faLink} 
    className={`${className} text-primary`}
  />
);

export const AIAgentIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <FontAwesomeIcon 
    icon={faRobot} 
    className={`${className} text-primary`}
  />
);

export const BenefitIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <FontAwesomeIcon 
    icon={faLightbulb} 
    className={`${className} text-primary`}
  />
);
