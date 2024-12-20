import {
  Entry,
  EntryType,
  HealthCheckEntry,
  OccupationalHealthcareEntry,
  HospitalEntry,
  HealthCheckRating,
} from "../../types";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import WorkIcon from "@mui/icons-material/Work";
import FavoriteIcon from "@mui/icons-material/Favorite";

const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
  switch (entry.type) {
    case EntryType.Hospital:
      return <HospitalEntryDetails entry={entry} />;
    case EntryType.OccupationalHealthcare:
      return <OccupationalHealthcareEntryDetails entry={entry} />;
    case EntryType.HealthCheck:
      return <HealthCheckEntryDetails entry={entry} />;
    default:
      return assertNever(entry);
  }
};

const HospitalEntryDetails = ({ entry }: { entry: HospitalEntry }) => {
  return (
    <>
      <div>
        {entry.date} <LocalHospitalIcon />
      </div>
      <div>
        <i>{entry.description}</i>
      </div>
      <div>
        Discharge: {entry.discharge.date}; {entry.discharge.criteria}
      </div>
    </>
  );
};

const OccupationalHealthcareEntryDetails = ({
  entry,
}: {
  entry: OccupationalHealthcareEntry;
}) => {
  return (
    <>
      <div>
        {entry.date} <WorkIcon /> {entry.employerName}
      </div>
      <div>
        <i>{entry.description}</i>
      </div>
      {entry.sickLeave && (
        <div>
          Sick leave: {entry.sickLeave.startDate} - {entry.sickLeave.endDate}
        </div>
      )}
    </>
  );
};

const HealthCheckEntryDetails = ({ entry }: { entry: HealthCheckEntry }) => {
  return (
    <>
      <div>
        {entry.date} <MedicalServicesIcon />
      </div>
      <div>
        <i>{entry.description}</i>
      </div>
      <HealthRatingIcon rating={entry.healthCheckRating} />
    </>
  );
};

const HealthRatingIcon = ({ rating }: { rating: HealthCheckRating }) => {
  switch (rating) {
    case HealthCheckRating.Healthy:
      return <FavoriteIcon style={{ color: "green" }} />;
    case HealthCheckRating.LowRisk:
      return <FavoriteIcon style={{ color: "yellow" }} />;
    case HealthCheckRating.HighRisk:
      return <FavoriteIcon style={{ color: "orange" }} />;
    case HealthCheckRating.CriticalRisk:
      return <FavoriteIcon style={{ color: "red" }} />;
  }
};

// Helper function for exhaustive type checking
const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

export default EntryDetails;
