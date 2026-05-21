import { useRef, useState } from 'react';

const REQUIRED_ANGLES = [
  { id: 'front', label: 'Front view', icon: '🚗' },
  { id: 'rear', label: 'Rear view', icon: '🔙' },
  { id: 'driver', label: 'Driver side', icon: '🚪' },
  { id: 'passenger', label: 'Passenger side', icon: '🚪' },
  { id: 'closeup', label: 'Close-up of damage', icon: '🔍' },
  { id: 'vin', label: 'VIN plate', icon: '🔢' },
];

export function PhotoGallery({ photos, onUpload }) {
  const fileInputRef = useRef(null);
  const [pendingLabel, setPendingLabel] = useState(null);

  const handleAngleClick = (angle) => {
    // Check if this angle already has a photo
    const alreadyUploaded = photos.some((p) => p.angleId === angle.id);
    if (alreadyUploaded) return;

    setPendingLabel(angle);
    fileInputRef.current?.click();
  };

  const handleGeneralUpload = () => {
    setPendingLabel(null);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const newPhoto = {
      id: `p-${Date.now()}`,
      url,
      label: pendingLabel ? pendingLabel.label : file.name.replace(/\.[^/.]+$/, ''),
      angleId: pendingLabel ? pendingLabel.id : null,
      uploadedAt: new Date().toISOString(),
    };
    onUpload(newPhoto);
    setPendingLabel(null);
    e.target.value = '';
  };

  return (
    <div>
      {/* Photo requirements checklist — click to upload */}
      <div className="photo-requirements">
        <h4 className="photo-requirements-title">📸 Required Photos</h4>
        <p className="photo-requirements-desc">
          Click an angle below to upload a photo for that view:
        </p>
        <div className="photo-requirements-grid">
          {REQUIRED_ANGLES.map((angle) => {
            const isUploaded = photos.some((p) => p.angleId === angle.id);
            return (
              <div
                className={`photo-requirement-item ${isUploaded ? 'uploaded' : 'clickable'}`}
                key={angle.id}
                onClick={() => !isUploaded && handleAngleClick(angle)}
                title={isUploaded ? `${angle.label} uploaded` : `Click to upload ${angle.label}`}
              >
                <span className="photo-requirement-icon">
                  {isUploaded ? '✓' : angle.icon}
                </span>
                <span className="photo-requirement-label">{angle.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Photo gallery */}
      <div className="photo-gallery">
        {photos.map((photo) => (
          <div className="photo-item" key={photo.id}>
            <img src={photo.url} alt={photo.label} />
            <div className="photo-item-label">{photo.label}</div>
          </div>
        ))}

        <div className="photo-upload-zone" onClick={handleGeneralUpload}>
          <div className="photo-upload-zone-icon">📷</div>
          <div className="photo-upload-zone-text">Upload Additional Photo</div>
        </div>
      </div>

      {/* Hidden file input shared by all upload triggers */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
  );
}
