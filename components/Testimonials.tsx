"use client"

import { Star, Quote } from "lucide-react"

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Tech Enthusiast",
      rating: 5,
      comment:
        "Amazing quality products and super fast delivery! I've been shopping here for 2 years and never disappointed.",
      avatar: "https://via.placeholder.com/60x60/F28C38/FFFFFF?text=SJ",
    },
    {
      id: 2,
      name: "Mike Chen",
      role: "Software Developer",
      rating: 5,
      comment: "Best prices I've found online, plus their customer service is outstanding. Highly recommend!",
      avatar: "https://via.placeholder.com/60x60/F5A623/FFFFFF?text=MC",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Designer",
      rating: 5,
      comment: "The product quality exceeded my expectations. Great selection and easy returns process.",
      avatar: "https://via.placeholder.com/60x60/FF5733/FFFFFF?text=ER",
    },
  ]

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star key={index} size={16} className={index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
    ))
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">What Our Customers Say</h2>
          <p className="text-lg text-gray-600">Don't just take our word for it - hear from our satisfied customers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-gray-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 relative"
            >
              <Quote size={24} className="text-orange-500 mb-4" />

              <div className="flex mb-4">{renderStars(testimonial.rating)}</div>

              <p className="text-gray-700 mb-6 italic">"{testimonial.comment}"</p>

              <div className="flex items-center">
                <img
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-orange-50 rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Join 50,000+ Happy Customers</h3>
            <p className="text-gray-600 mb-6">
              Experience the difference with our premium electronics and exceptional service
            </p>
            <div className="flex justify-center items-center gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-orange-500">4.9/5</div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-500">50K+</div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-500">99%</div>
                <div className="text-sm text-gray-600">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
