import { Link } from "react-router-dom";
import { FaQuestionCircle, FaTicketAlt } from "react-icons/fa";

function Home() {
  return (
    <>
      <section className="heading">
        <h1>Vac Q: A Vaccine Booking System</h1>
        <p>Please coohse from options below</p>
      </section>
      <Link to="/new-ticket" className="btn btn-reverse btn-block">
        <FaQuestionCircle />
        Crate New Appointment
      </Link>
      <Link to="/tickets" className="btn btn-bloack">
        <FaTicketAlt />
        View My Appointments
      </Link>
    </>
  );
}

export default Home;
