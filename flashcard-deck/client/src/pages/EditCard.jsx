import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCardById, updateCard } from '../services/api';
import { toast } from 'react-toastify';

const EditCard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const [form, setForm] = useState({
    title: '',
    category: 'JavaScript',
    question: '',
    answer: '',
    difficulty: 'Medium',
    animationType: 'flip',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    fetchCard();
  }, [id]);

  const fetchCard = async () => {
    try {
      const res = await getCardById(id);
      setForm(res.data);
    } catch (error) {
      toast.error('Failed to load card');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!form.tags.includes(tagInput.trim())) {
        setForm({ ...form, tags: [...form.tags, tagInput.trim()] });
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setForm({ ...form, tags: form.tags.filter(tag => tag !== tagToRemove) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateCard(id, form);
      toast.success('Card updated successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update card');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Loading card...</div>;

  return (
    <div className="form-container">
      <div className="form-card">
        <h2>Edit Flashcard</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter card title"
              required
              maxLength={100}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select name="category" value={form.category} onChange={handleChange} required>
                <option value="JavaScript">JavaScript</option>
                <option value="Python">Python</option>
                <option value="React">React</option>
                <option value="Node.js">Node.js</option>
                <option value="CSS">CSS</option>
                <option value="HTML">HTML</option>
                <option value="Database">Database</option>
                <option value="DevOps">DevOps</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Difficulty</label>
              <select name="difficulty" value={form.difficulty} onChange={handleChange} required>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Question</label>
            <textarea
              name="question"
              value={form.question}
              onChange={handleChange}
              placeholder="Enter the question"
              required
              maxLength={500}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>Answer</label>
            <textarea
              name="answer"
              value={form.answer}
              onChange={handleChange}
              placeholder="Enter the answer"
              required
              maxLength={1000}
              rows={4}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Animation Type</label>
              <select name="animationType" value={form.animationType} onChange={handleChange}>
                <option value="flip">Flip</option>
                <option value="slide">Slide</option>
                <option value="zoom">Zoom</option>
                <option value="fade">Fade</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Tags (Press Enter to add)</label>
            <div className="tags-input">
              {form.tags.map(tag => (
                <span key={tag} className="tag">
                  {tag}
                  <button type="button" onClick={() => handleRemoveTag(tag)}>×</button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Add tags..."
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => setPreview(!preview)}>
              {preview ? 'Hide Preview' : 'Show Preview'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>

        {preview && (
          <div className="flashcard-container" style={{ marginTop: '30px' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '15px', color: '#333' }}>Preview</h3>
            <FlashcardPreview card={form} />
          </div>
        )}
      </div>
    </div>
  );
};

const FlashcardPreview = ({ card }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="flashcard-container" onClick={() => setIsFlipped(!isFlipped)}>
      <div className={`flashcard ${isFlipped ? 'flipped' : ''}`}>
        <div className="flashcard-face flashcard-front">
          <h3>{card.title || 'Card Title'}</h3>
          <p>{card.question || 'Your question will appear here'}</p>
          <span className="flashcard-hint">Click to flip</span>
        </div>
        <div className="flashcard-face flashcard-back">
          <h3>Answer</h3>
          <p>{card.answer || 'Your answer will appear here'}</p>
        </div>
      </div>
    </div>
  );
};

export default EditCard;
