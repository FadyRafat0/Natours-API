import { useState, type FormEvent } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userImg } from '../../utils/helpers';
import API from '../../api';

const SettingsContent = () => {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [settingsMsg, setSettingsMsg] = useState('');
  const [settingsErr, setSettingsErr] = useState('');
  const [settingsLoading, setSettingsLoading] = useState(false);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordErr, setPasswordErr] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSettingsSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSettingsMsg('');
    setSettingsErr('');
    setSettingsLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      if (photo) formData.append('photo', photo);

      await updateUser(formData);
      setSettingsMsg('Data updated successfully!');
      setPhoto(null);
      setPhotoPreview('');
    } catch (err: any) {
      setSettingsErr(err.response?.data?.message || 'Failed to update. Please try again.');
    } finally {
      setSettingsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordMsg('');
    setPasswordErr('');

    if (newPassword !== passwordConfirm) {
      return setPasswordErr('New passwords do not match.');
    }

    setPasswordLoading(true);
    try {
      await API.patch('/users/updatePassword', {
        oldPassword,
        newPassword,
        passwordConfirm,
      });
      setPasswordMsg('Password updated successfully!');
      setOldPassword('');
      setNewPassword('');
      setPasswordConfirm('');
    } catch (err: any) {
      setPasswordErr(err.response?.data?.message || 'Failed to update password. Please try again.');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <div className="user-view__form-container">
        <h2 className="heading-secondary ma-bt-md">Your account settings</h2>
        {settingsMsg && <div style={{ marginBottom: '2rem', color: '#20bf6b', fontSize: '1.4rem' }}>{settingsMsg}</div>}
        {settingsErr && <div style={{ marginBottom: '2rem', color: '#eb4d4b', fontSize: '1.4rem' }}>{settingsErr}</div>}

        <form className="form form-user-data" onSubmit={handleSettingsSubmit}>
          <div className="form__group">
            <label className="form__label" htmlFor="name">Name</label>
            <input className="form__input" id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="form__group ma-bt-md">
            <label className="form__label" htmlFor="email">Email address</label>
            <input className="form__input" id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="form__group form__photo-upload">
            <img className="form__user-photo" src={photoPreview || userImg(user.photo)} alt="User photo" />
            <input className="form__upload" type="file" accept="image/*" id="photo" onChange={handlePhotoChange} style={{ display: 'none' }} />
            <label htmlFor="photo" className="btn-text" style={{ cursor: 'pointer' }}>Choose new photo</label>
          </div>
          <div className="form__group right">
            {!user.isVerified && (
              <button 
                type="button" 
                className="btn btn--small btn--green" 
                style={{ marginRight: '1rem', backgroundColor: '#f39c12', borderColor: '#f39c12' }}
                onClick={async () => {
                  try {
                    await API.post('/users/sendVerificationOtp');
                    alert('Email sent!');
                    window.location.assign('/verify-email');
                  } catch (err: any) {
                    alert(err.response?.data?.message || 'Error sending email');
                  }
                }}
              >
                Verify Email
              </button>
            )}
            <button className="btn btn--small btn--green" disabled={settingsLoading}>
              {settingsLoading ? 'Saving...' : 'Save settings'}
            </button>
          </div>
        </form>
      </div>

      <div className="line">&nbsp;</div>

      <div className="user-view__form-container">
        <h2 className="heading-secondary ma-bt-md">Password change</h2>
        {passwordMsg && <div style={{ marginBottom: '2rem', color: '#20bf6b', fontSize: '1.4rem' }}>{passwordMsg}</div>}
        {passwordErr && <div style={{ marginBottom: '2rem', color: '#eb4d4b', fontSize: '1.4rem' }}>{passwordErr}</div>}

        <form className="form form-user-password" onSubmit={handlePasswordSubmit}>
          <div className="form__group">
            <label className="form__label" htmlFor="password-current">Current password</label>
            <input className="form__input" id="password-current" type="password" placeholder="••••••••" required minLength={8} value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
          </div>
          <div className="form__group">
            <label className="form__label" htmlFor="password">New password</label>
            <input className="form__input" id="password" type="password" placeholder="••••••••" required minLength={8} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          <div className="form__group ma-bt-lg">
            <label className="form__label" htmlFor="password-confirm">Confirm password</label>
            <input className="form__input" id="password-confirm" type="password" placeholder="••••••••" required minLength={8} value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} />
          </div>
          <div className="form__group right">
            <button className="btn btn--small btn--green" disabled={passwordLoading}>
              {passwordLoading ? 'Saving...' : 'Save password'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default SettingsContent;
