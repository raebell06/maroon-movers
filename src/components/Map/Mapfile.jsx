import React, { useEffect } from 'react'

export default function Map() {
  useEffect(() => {
    // Load TomTom CSS
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.23.0/maps/maps.css'
    document.head.appendChild(link)

    // Load TomTom JS
    const script = document.createElement('script')
    script.src = 'https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.23.0/maps/maps-web.min.js'
    script.onload = () => {
      // Initialize map after script loads
      if (window.tt) {
        const map = window.tt.map({
          key: 'z6IEYnpb4ohOXgZZ7Dlc12rnZ9EuSaip',
          container: 'map',
          center: [-86.57, 34.78], // Alabama A&M University, Huntsville
          zoom: 12
        })
      }
    }
    document.head.appendChild(script)
  }, [])

  return (
    <div 
      id="map" 
      style={{
        width: '100%',
        height: '300px',
        borderRadius: '12px',
        overflow: 'hidden'
      }}
    />
  )
}
