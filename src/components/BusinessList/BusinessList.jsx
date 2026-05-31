import Business from "../Business/Business";
import "./BusinessList.css";

function BusinessList({ businesses }) {
  return (
    <div className="BusinessList">
      {businesses.map((business, idx) =>
        <Business key={idx} business={business} />
      )}
    </div>
  )
}

export default BusinessList;
