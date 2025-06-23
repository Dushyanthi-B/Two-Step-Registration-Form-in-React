import React, { useState, useEffect, useRef } from 'react';
import './PhoneField.css';

const countryCodes = [
  { code: '+1', country: 'US', flag: '🇺🇸' },
  { code: '+44', country: 'GB', flag: '🇬🇧' },
  { code: '+91', country: 'IN', flag: '🇮🇳' },
  { code: '+86', country: 'CN', flag: '🇨🇳' },
  { code: '+81', country: 'JP', flag: '🇯🇵' },
  { code: '+49', country: 'DE', flag: '🇩🇪' },
  { code: '+33', country: 'FR', flag: '🇫🇷' },
  { code: '+39', country: 'IT', flag: '🇮🇹' },
  { code: '+34', country: 'ES', flag: '🇪🇸' },
  { code: '+7', country: 'RU', flag: '🇷🇺' },
  { code: '+55', country: 'BR', flag: '🇧🇷' },
  { code: '+61', country: 'AU', flag: '🇦🇺' },
  { code: '+27', country: 'ZA', flag: '🇿🇦' },
  { code: '+971', country: 'AE', flag: '🇦🇪' },
  { code: '+966', country: 'SA', flag: '🇸🇦' },
  { code: '+20', country: 'EG', flag: '🇪🇬' },
  { code: '+234', country: 'NG', flag: '🇳🇬' },
  { code: '+254', country: 'KE', flag: '🇰🇪' },
  { code: '+880', country: 'BD', flag: '🇧🇩' },
  { code: '+92', country: 'PK', flag: '🇵🇰' },
  { code: '+94', country: 'LK', flag: '🇱🇰' },
];

const PhoneField = ({ 
  label, 
  value = '', 
  onChange, 
  onBlur, 
  error = '', 
  required = false, 
  placeholder = 'Enter phone number (optional)' 
}) => {
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(value.replace(/^\+\d+\s*/, ''));
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCountryChange = (country) => {
    console.log('Country selected:', country); // Debug log
    setSelectedCountry(country);
    setIsDropdownOpen(false);
    
    // Update the full phone number with new country code
    const fullNumber = phoneNumber ? `${country.code} ${phoneNumber}`.trim() : '';
    onChange({ target: { value: fullNumber } });
  };

  const toggleDropdown = () => {
    console.log('Toggle dropdown, current state:', isDropdownOpen); // Debug log
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handlePhoneChange = (e) => {
    const number = e.target.value;
    setPhoneNumber(number);
    
    // Combine country code with phone number (only if number is provided)
    const fullNumber = number ? `${selectedCountry.code} ${number}`.trim() : '';
    onChange({ target: { value: fullNumber } });
  };

  const handleBlur = (e) => {
    if (onBlur) {
      const fullNumber = phoneNumber ? `${selectedCountry.code} ${phoneNumber}`.trim() : '';
      onBlur({ target: { value: fullNumber } });
    }
  };

  return (
    <div className="phone-field">
      <label className="field-label">
        {label} <span className="optional-text">(optional)</span>
      </label>
      
      <div className="phone-input-container">
        <div className="country-selector" ref={dropdownRef}>
          <button
            type="button"
            className="country-selector-button"
            onClick={toggleDropdown}
          >
            <span className="country-flag">{selectedCountry.flag}</span>
            <span className="country-code">{selectedCountry.code}</span>
            <span className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}>▼</span>
          </button>
          
          {isDropdownOpen && (
            <div className="country-dropdown" style={{ border: '2px solid red' }}>
              <div style={{ padding: '10px', background: '#f0f0f0', borderBottom: '1px solid #ccc' }}>
                Select Country ({countryCodes.length} available)
              </div>
              {countryCodes.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  className="country-option"
                  onClick={() => handleCountryChange(country)}
                >
                  <span className="country-flag">{country.flag}</span>
                  <span className="country-code">{country.code}</span>
                  <span className="country-name">{country.country}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        
        <input
          type="tel"
          className={`phone-input ${error ? 'error' : ''}`}
          value={phoneNumber}
          onChange={handlePhoneChange}
          onBlur={handleBlur}
          placeholder={placeholder}
        />
      </div>
      
      {error && <div className="field-error">{error}</div>}
    </div>
  );
};

export default PhoneField; 