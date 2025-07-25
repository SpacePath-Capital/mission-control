'use client';

import React, { useState } from 'react';
import Image from 'next/image';

// Define FIELD_LABELS to fix the error
const FIELD_LABELS = [
  'Ticker', 'Quantity', 'Price', 'PM', 'Subsector', 'Strategy', 'Thesis', 'Notes', 'Upside Price', 'Downside Price'
];

const SUBSECTORS = [
  'OEMs', 'Biz Jet OEMs', 'Engine Suppliers', 'Electro/Mechanical Suppliers', 'Multi-Industry Suppliers',
  'Structures Suppliers', 'Materials & Components Suppliers', 'IP Aftermarket', 'Aftermarket Suppliers',
  'Def. Electronics', 'Def. Tech', 'eVTOL',
];

const TICKERS = [
  'AVAV', 'AGCO', 'GOOG', 'AMZN', 'ANSS', 'BA.L', 'BA', 'BAH', 'CCI', 'DE', 'ESLT', 'ETL.PA', 'GRMN', 'GD', 'HON',
  'HWM', 'IRDM', 'KBR', 'LHX', 'LDOS', 'M0YN.DE', 'NOC', 'RHM.DE', 'SAF.PA', 'SBAC', 'SAIC', 'HO.PA', 'TRMB', 'PATH',
  'ACHR', 'ASTS', 'BKSY', 'BLDE', 'CMBM', 'CMTL', 'DDD', 'EVTL', 'GILT', 'GSAT', 'IHS', 'IOT', 'JOBY', 'KTOS', 'LASR',
  'MAL.TO', 'MDA.TO', 'MNTS', 'MOG-A', 'MTLS', 'NNDM', 'OHB.DE', 'PL', 'PRLB', 'RCAT', 'RDW', 'RKLB', 'SATX', 'SESG.PA',
  'SIDU', 'SPCE', 'SPIR', 'SSYS', 'TER', 'VSAT', 'XMTR', 'TSLA', 'NVDA', 'PLTR', 'RTX', 'LMT', 'CACI', 'AMT', 'ITMSF',
  'TSAT', 'LUNR', 'KRMN', 'SIRI',
];

const menuStyle = {
  fontFamily: "'Orbitron', sans-serif",
  backgroundColor: 'black',
  color: 'black',
  padding: 20,
  minWidth: 400,
  fontWeight: 'bold',
  zIndex: 100,
  position: 'absolute',
  marginTop: 10,
  marginLeft: 10,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  border: '3px solid white',
};

const menuItemStyle = {
  cursor: 'pointer',
  padding: '10px',
  margin: '10px 0', // 10px spacing between main menu items
  backgroundColor: 'white',
  color: 'black',
  width: '80%',
  transition: 'background 0.2s, color 0.2s',
  fontWeight: 'bold',
  border: '3px solid white',
};

const menuItemHoverStyle = {
  backgroundColor: 'black',
  color: 'white',
};

const submenuStyle = {
  marginLeft: 0,
  paddingLeft: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  border: '3px solid white',
  backgroundColor: 'black',
  minWidth: 400, // Match main menu width
};

const buttonStyle = {
  padding: '10px 20px',
  cursor: 'pointer',
  fontFamily: "'Orbitron', sans-serif",
  fontWeight: 'bold',
  backgroundColor: 'white',
  color: 'black',
  width: '80%',
  textAlign: 'center',
  transition: 'background 0.2s, color 0.2s',
  border: '3px solid white',
  margin: '10px 0', // 10px spacing between submenu buttons, matching main menu
};

const buttonHoverStyle = {
  backgroundColor: 'black',
  color: 'white',
};

const backButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#333',
  color: 'white',
};

const submitButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#FFA500',
  color: 'white',
};

const inputStyle = {
  width: '100%',
  padding: '8px',
  marginBottom: '10px',
  backgroundColor: 'black',
  color: 'white',
  border: '3px solid white',
  fontFamily: "'Orbitron', sans-serif",
};

const labelStyle = {
  display: 'block',
  margin: '10px 0 5px',
  color: '#FFF',
  textAlign: 'left',
};

const dialogStyle = {
  fontFamily: "'Orbitron', sans-serif",
  backgroundColor: 'black',
  color: 'white',
  padding: 20,
  border: '3px solid white',
  minWidth: 350,
  maxWidth: 420,
  fontWeight: 'bold',
};

const dialogOverlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.75)',
  zIndex: 99999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

function TradeModal({ open, onClose, onSubmit, type, portfolio, title }) {
  const [fields, setFields] = useState({
    Ticker: '',
    Quantity: '',
    Price: '',
    PM: '',
    Subsector: '',
    Strategy: '',
    Thesis: '',
    Notes: '',
    'Upside Price': '',
    'Downside Price': '',
  });
  const [errors, setErrors] = useState({});
  const [editCriteria, setEditCriteria] = useState({
    Ticker: '',
    PM: '',
    entryDate: '',
  });

  React.useEffect(() => {
    setFields({
      Ticker: '',
      Quantity: '',
      Price: '',
      PM: '',
      Subsector: '',
      Strategy: '',
      Thesis: '',
      Notes: '',
      'Upside Price': '',
      'Downside Price': '',
    });
    setErrors({});
    setEditCriteria({ Ticker: '', PM: '', entryDate: '' });
  }, [open, type, portfolio, title]);

  const validate = () => {
    const newErrors = {};
    if (!fields.Ticker.trim()) newErrors.Ticker = 'Ticker is required.';
    if ((type !== 'edit') && (!fields.Quantity || isNaN(fields.Quantity) || Number(fields.Quantity) <= 0))
      newErrors.Quantity = 'Quantity must be positive.';
    if ((type !== 'edit') && (!fields.Price || isNaN(fields.Price) || Number(fields.Price) <= 0))
      newErrors.Price = 'Price must be positive.';
    if (!fields.PM.trim()) newErrors.PM = 'Portfolio Manager is required.';
    if (type === 'edit') {
      if (!editCriteria.Ticker.trim()) newErrors.editTicker = 'Edit Ticker required.';
      if (!editCriteria.PM.trim()) newErrors.editPM = 'Edit PM required.';
      if (!editCriteria.entryDate.trim()) newErrors.editEntryDate = 'Edit entryDate required.';
    }
    return newErrors;
  };

  const handleChange = (field, value) => {
    setFields({ ...fields, [field]: value });
    setErrors({ ...errors, [field]: undefined });
  };

  const handleEditCriteriaChange = (field, value) => {
    setEditCriteria({ ...editCriteria, [field]: value });
    setErrors({ ...errors, [`edit${field}`]: undefined });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const trade = {
      ...fields,
      entryDate: type === 'edit' ? fields.entryDate || '' : new Date().toISOString().split('T')[0],
    };
    if (type === 'edit') {
      onSubmit(type, portfolio, trade, editCriteria);
    } else {
      onSubmit(type, portfolio, trade);
    }
    onClose();
  };

  if (!open) return null;

  return (
    <div style={dialogOverlayStyle}>
      <div style={{
        ...dialogStyle,
        minWidth: 1200,
        maxWidth: 1400,
        minHeight: 500,
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 24,
            right: 24,
            background: 'none',
            border: 'none',
            color: '#fff',
            fontFamily: "'Orbitron', sans-serif",
            fontSize: 28,
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
          aria-label="Close"
        >×</button>
        <h2 style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: 28,
          fontWeight: 'bold',
          marginBottom: 32,
          textAlign: 'center',
          letterSpacing: 2,
        }}>
          {title || (type === 'add' ? 'Add Trade' : type === 'subtract' ? 'Subtract Trade' : 'Edit Trade') + ' — ' + portfolio + ' Portfolio'}
        </h2>
        <form onSubmit={handleSubmit} style={{
          display: 'grid',
          gridTemplateColumns: '360px 1fr',
          gap: '24px 32px',
          alignItems: 'center',
        }}>
          {type === 'edit' && (
            <>
              <div style={{ ...labelStyle, fontSize: 18, minHeight: 36, lineHeight: '36px' }}>Edit Ticker</div>
              <div style={{ minHeight: 48 }}>
                <select
                  style={inputStyle}
                  value={editCriteria.Ticker}
                  onChange={e => handleEditCriteriaChange('Ticker', e.target.value)}
                  required
                >
                  <option value="">Select Ticker</option>
                  {TICKERS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                {errors.editTicker && <span style={{ color: '#FFA500', ...labelStyle, fontSize: 13, marginTop: 3 }}>{errors.editTicker}</span>}
              </div>
              <div style={{ ...labelStyle, fontSize: 18, minHeight: 36, lineHeight: '36px' }}>Edit PM</div>
              <div style={{ minHeight: 48 }}>
                <input
                  style={inputStyle}
                  type="text"
                  value={editCriteria.PM}
                  onChange={e => handleEditCriteriaChange('PM', e.target.value)}
                  placeholder="Portfolio Manager"
                  required
                />
                {errors.editPM && <span style={{ color: '#FFA500', ...labelStyle, fontSize: 13, marginTop: 3 }}>{errors.editPM}</span>}
              </div>
              <div style={{ ...labelStyle, fontSize: 18, minHeight: 36, lineHeight: '36px' }}>Edit entryDate</div>
              <div style={{ minHeight: 48 }}>
                <input
                  style={inputStyle}
                  type="text"
                  value={editCriteria.entryDate}
                  onChange={e => handleEditCriteriaChange('entryDate', e.target.value)}
                  placeholder="YYYY-MM-DD"
                  required
                />
                {errors.editEntryDate && <span style={{ color: '#FFA500', ...labelStyle, fontSize: 13, marginTop: 3 }}>{errors.editEntryDate}</span>}
              </div>
            </>
          )}

          {FIELD_LABELS.map(label => (
            <React.Fragment key={label}>
              <div style={{ ...labelStyle, fontSize: 18, minHeight: 36, lineHeight: '36px' }}>{label}</div>
              <div style={{ minHeight: 48, display: 'flex', flexDirection: 'column' }}>
                {label === 'Ticker' ? (
                  <select
                    style={inputStyle}
                    value={fields[label]}
                    onChange={e => handleChange(label, e.target.value)}
                    required
                  >
                    <option value="">Select Ticker</option>
                    {TICKERS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                ) : label === 'Subsector' ? (
                  <select
                    style={inputStyle}
                    value={fields[label]}
                    onChange={e => handleChange(label, e.target.value)}
                  >
                    <option value="">Select Subsector</option>
                    {SUBSECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                ) : label === 'Thesis' || label === 'Notes' ? (
                  <textarea
                    style={{
                      ...inputStyle,
                      minHeight: 60,
                      resize: 'vertical',
                    }}
                    value={fields[label]}
                    onChange={e => handleChange(label, e.target.value)}
                    placeholder={label}
                  />
                ) : (
                  <input
                    style={inputStyle}
                    type={label.includes('Price') ? 'number' : 'text'}
                    value={fields[label]}
                    onChange={e => handleChange(label, e.target.value)}
                    placeholder={label}
                    min={label.includes('Price') ? 0 : undefined}
                    step={label.includes('Price') ? '0.01' : undefined}
                    required={['Ticker', 'Quantity', 'Price', 'PM'].includes(label)}
                  />
                )}
                {errors[label] && (
                  <span style={{ color: '#FFA500', ...labelStyle, fontSize: 13, marginTop: 3 }}>{errors[label]}</span>
                )}
              </div>
            </React.Fragment>
          ))}
          <div />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                ...backButtonStyle,
                fontSize: 18,
                borderRadius: 6,
                padding: '12px 32px',
                marginRight: 12,
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#444')}
              onMouseOut={e => (e.currentTarget.style.background = '#333')}
            >Cancel</button>
            <button
              type="submit"
              style={{
                ...submitButtonStyle,
                fontSize: 18,
                borderRadius: 6,
                padding: '12px 32px',
                marginLeft: 12,
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#FFB733')}
              onMouseOut={e => (e.currentTarget.style.background = '#FFA500')}
            >Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function TradeBlotter() {
  const [showMenu, setShowMenu] = useState(false);
  const [activeMenu, setActiveMenu] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [modalPortfolio, setModalPortfolio] = useState('Long');
  const [modalTitle, setModalTitle] = useState('');

  const handleTrade = async (type, portfolio, trade, editCriteria) => {
    try {
      await fetch('/api/pros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: type === 'add' ? 'addTrade' : type === 'subtract' ? 'removeTrade' : 'updateDetails',
          portfolioType: portfolio,
          trade,
          editCriteria: editCriteria || null,
        }),
      });
      alert('Trade processed!');
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const renderMainMenu = () => (
    <div style={menuStyle}>
      <h1 style={{
        fontFamily: "'Orbitron', sans-serif",
        fontSize: 24,
        marginBottom: 10,
        textAlign: 'center',
        color: 'white',
      }}>
        SpacePath Capital
      </h1>
      <div style={{ ...menuItemStyle, color: 'green' }}
        onClick={() => setActiveMenu(activeMenu === 'long' ? '' : 'long')}
        onMouseEnter={e => Object.assign(e.target.style, menuItemHoverStyle)}
        onMouseLeave={e => Object.assign(e.target.style, menuItemStyle)}
      >
        Long Portfolio
      </div>
      <div style={{ ...menuItemStyle, color: 'red' }}
        onClick={() => setActiveMenu(activeMenu === 'short' ? '' : 'short')}
        onMouseEnter={e => Object.assign(e.target.style, menuItemHoverStyle)}
        onMouseLeave={e => Object.assign(e.target.style, menuItemStyle)}
      >
        Short Portfolio
      </div>
      <div style={menuItemStyle}
        onClick={() => setActiveMenu(activeMenu === 'watchlist' ? '' : 'watchlist')}
        onMouseEnter={e => Object.assign(e.target.style, menuItemHoverStyle)}
        onMouseLeave={e => Object.assign(e.target.style, menuItemStyle)}
      >
        Watchlist
      </div>
      <div style={menuItemStyle}
        onClick={() => setActiveMenu(activeMenu === 'edit' ? '' : 'edit')}
        onMouseEnter={e => Object.assign(e.target.style, menuItemHoverStyle)}
        onMouseLeave={e => Object.assign(e.target.style, menuItemStyle)}
      >
        Edit Details
      </div>
    </div>
  );

  const renderSubMenu = () => {
    const menuOptions = {
      long: ['Add to Long Portfolio', 'Subtract from Long Portfolio'],
      short: ['Add to Short Portfolio', 'Subtract from Short Portfolio'],
      watchlist: ['Add to Watchlist', 'Subtract from Watchlist'],
      edit: ['Edit Long Portfolio', 'Edit Short Portfolio', 'Edit Watchlist'],
    };

    return (
      <div style={submenuStyle}>
        <h1 style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: 24,
          marginBottom: 10,
          textAlign: 'center',
          color: 'white',
        }}>
          {activeMenu.charAt(0).toUpperCase() + activeMenu.slice(1)} Portfolio
        </h1>
        {menuOptions[activeMenu].map(option => (
          <button key={option} style={buttonStyle}
            onClick={() => {
              const [type, portfolio] = option.toLowerCase().split(' ');
              setShowMenu(false);
              setActiveMenu('');
              setModalType(type);
              setModalPortfolio(portfolio);
              setModalTitle(option);
              setShowModal(true);
            }}
            onMouseEnter={e => Object.assign(e.target.style, buttonHoverStyle)}
            onMouseLeave={e => Object.assign(e.target.style, buttonStyle)}
          >
            {option}
          </button>
        ))}
        <button style={{
          fontFamily: "'Orbitron', sans-serif",
          fontWeight: 'bold',
          color: 'white',
          padding: '10px 20px',
          margin: '10px 0',
          cursor: 'pointer',
          width: '80%',
          border: 'none',
          background: 'none',
        }}
          onClick={() => setActiveMenu('')}
        >
          Back to Main Menu
        </button>
      </div>
    );
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, margin: 16, zIndex: 50 }}>
      <Image
        src="/iss.gif"
        alt="ISS Icon"
        width={80}
        height={80}
        unoptimized
        className="cursor-pointer"
        style={{ cursor: 'pointer' }}
        onClick={() => setShowMenu(!showMenu)}
      />
      {showMenu && (activeMenu ? renderSubMenu() : renderMainMenu())}
      {showModal && (
        <TradeModal
          open={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleTrade}
          type={modalType}
          portfolio={modalPortfolio}
          title={modalTitle}
        />
      )}
    </div>
  );
}