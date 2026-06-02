const TestimonialCard = ({ avatar, name, role, quote }) => (
  <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
    <div className="flex items-center mb-6">
      <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover" />
      <div className="ml-4">
        <h4 className="font-semibold text-gray-900">{name}</h4>
        <p className="text-sm text-gray-600">{role}</p>
      </div>
    </div>
    <p className="text-gray-700 leading-relaxed">"{quote}"</p>
  </div>
);

export default TestimonialCard;
