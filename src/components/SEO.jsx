// src/Components/SEO.jsx
import { Helmet } from "react-helmet-async"

const SEO = ({
  title = "Artisan Hub",
  description = "",
  url = "https://yourdomain.com",
  image = "https://yourdomain.com/images/og-default.jpg",
}) => {
  return (
    <Helmet>
      <title>{title} | Artisan Hub</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
    </Helmet>
  )
}

export default SEO


// Sample SEO
//      <SEO 
//         title="About Us | Your Brand Name" 
//         description="Learn more about our story, mission, and passion for crafting quality shoes." 
//         url="https://yourdomain.com/about"
//       />