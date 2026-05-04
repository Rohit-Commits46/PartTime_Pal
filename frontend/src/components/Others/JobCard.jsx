const JobCard = ({
  employer,
  title,
  city,
  type,
  salary,
  description,
  logo,
}) => {
  return (
    <div className="bg-white p-6 shadow rounded-lg hover:shadow-lg transition-shadow flex items-center space-x-6">
      <div className="w-1/4 flex justify-center">
        <div className="bg-gray-100 rounded-full h-20 w-20 flex items-center justify-center">
          <img
            src={logo}
            alt={`${employer} Logo`}
            className="h-16 w-16 object-contain"
          />
        </div>
      </div>
      <div className="w-3/4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg text-gray-800">{employer}</h3>
          <p className="text-sm text-gray-500">{type}</p>
        </div>
        <p className="text-blue-600 text-sm font-medium">{title}</p>
        <p className="text-gray-700 mt-2">{description}</p>
        <div className="mt-4 flex justify-between">
          <p className="text-gray-600 text-sm">City: {city}</p>
          <p className="text-gray-600 text-sm">Salary: {salary}</p>
        </div>
        <button className="mt-4 bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600">
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default JobCard;
