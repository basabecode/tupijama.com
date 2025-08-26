export default function Brands() {
  const brands = [
    { name: "TechCorp", logo: "https://via.placeholder.com/150x80/F28C38/FFFFFF?text=TechCorp" },
    { name: "ElectroMax", logo: "https://via.placeholder.com/150x80/F5A623/FFFFFF?text=ElectroMax" },
    { name: "DigitalPro", logo: "https://via.placeholder.com/150x80/FF5733/FFFFFF?text=DigitalPro" },
    { name: "SmartTech", logo: "https://via.placeholder.com/150x80/F28C38/FFFFFF?text=SmartTech" },
    { name: "InnovateLab", logo: "https://via.placeholder.com/150x80/F5A623/FFFFFF?text=InnovateLab" },
    { name: "FutureTech", logo: "https://via.placeholder.com/150x80/FF5733/FFFFFF?text=FutureTech" },
  ]

  return (
    <section className="py-16 bg-white" aria-labelledby="brands-heading">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 id="brands-heading" className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Trusted Brands
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We partner with leading technology brands to bring you the best products and latest innovations.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {brands.map((brand, index) => (
            <div
              key={index}
              className="flex items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300 group"
            >
              <img
                src={brand.logo || "/placeholder.svg"}
                alt={`${brand.name} logo`}
                className="max-w-full h-auto opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
