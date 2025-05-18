export default function BenefitsSection() {
  const benefits = [
    {
      title: 'Speed',
      description: 'Blazingly fast performance that keeps visitors engaged',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      )
    },
    {
      title: 'Simplicity',
      description: 'No coding required—just your creativity',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 14s1.5 2 4 2 4-2 4-2" />
          <line x1="9" y1="9" x2="9.01" y2="9" />
          <line x1="15" y1="9" x2="15.01" y2="9" />
        </svg>
      )
    },
    {
      title: 'Flexibility',
      description: 'Customizable designs that reflect your unique style',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
          <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 1 7.92 12.446a9 9 0 1 1 -16.626 0a7.5 7.5 0 0 1 7.92 -12.446c.13 0 .262 0 .393 0z" />
          <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
        </svg>
      )
    },
    {
      title: 'Growth',
      description: 'Built-in tools to grow your audience and reach',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
      )
    }
  ];

  return (
    <section className="py-16 sm:py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold tracking-tight text-foreground text-center mb-12">
          Why Creators Choose Minispace
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="mb-4 rounded-full bg-primary/10 p-2 text-primary">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-medium mb-2">{benefit.title}</h3>
              <p className="text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}