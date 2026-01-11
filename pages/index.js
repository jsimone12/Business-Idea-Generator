import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Clock, Target, TrendingUp } from 'lucide-react';

export default function BusinessIdeaGenerator() {
  const [step, setStep] = useState('welcome');
  const [userInfo, setUserInfo] = useState({ fname: '', lname: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState({
    q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: []
  });
  const [businessIdeas, setBusinessIdeas] = useState('');

  useEffect(() => {
    const link1 = document.createElement('link');
    link1.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@600&family=DM+Sans:wght@400;500&family=Playfair+Display:ital@1&display=swap';
    link1.rel = 'stylesheet';
    document.head.appendChild(link1);
    
    const params = new URLSearchParams(window.location.search);
    setUserInfo({
      fname: params.get('fname') || '',
      lname: params.get('lname') || '',
      email: params.get('email') || '',
      phone: params.get('phone') || ''
    });
  }, []);

  const handleAnswerChange = (question, value) => {
    setAnswers(prev => ({ ...prev, [question]: value }));
  };

  const handleCheckboxChange = (question, value) => {
    setAnswers(prev => {
      const current = prev[question] || [];
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [question]: updated };
    });
  };

  const generateIdeas = async () => {
    setLoading(true);
    setStep('loading');

    const prompt = `You are an expert business consultant helping burned-out corporate professionals (specifically Black women and LGBTQ+ individuals) transition to entrepreneurship. 

Based on these answers, generate 3 specific, actionable business ideas following this EXACT structure:

CLIENT PROFILE:
- Name: ${userInfo.fname} ${userInfo.lname}
- Dream activity (if money wasn't a concern): ${answers.q1}
- Biggest corporate frustration: ${answers.q2}
- Professional enjoyment/flow state: ${answers.q3}
- What people ask them for help with: ${answers.q4}
- Time available: ${answers.q5}
- Success vision (1-3 years): ${answers.q6}
- What's most important in next chapter: ${answers.q7.join(', ')}

Generate 3 business ideas with this structure:

IDEA 1: THE QUICK WIN (matches their current time availability)
**[Catchy Business Name]**
*[One-line description]*

**The Problem You'll Solve:** [Specific pain point for specific audience]

**Who This Serves:** [Target market - be specific]

**What You'll Offer:** [Service or product format]

**Why You're Positioned to Win:** [Their unique angle based on lived experience from their answers]

**What Makes This Exciting:** [Lifestyle/impact/freedom angle - reference their Q6/Q7 answers]

**What You'll Need to Figure Out:** [Create just enough complexity to show they need guidance]

---

IDEA 2: THE SMART SCALE (digital product built once, sold many times)
[Follow same structure]

---

IDEA 3: THE MOONSHOT (ignore time constraints - this is their dream outcome)
[Follow same structure - make this align perfectly with their Q6 success vision]

---

**This is Your Moment**

You've got three paths forward:
- Start small and build momentum ✅
- Create leverage with digital products ✅✅
- Build the business that gives you complete freedom ✅✅✅

**But here's the truth:** Ideas don't make money. Execution does.

The gap between where you are and where you want to be isn't more information - it's strategy, systems, and support from someone who's already done it.

**Book your free 30-minute strategy call** and let's map out how you go from idea to execution in 7 days or less.

On this call, we'll:
✔️ Determine which idea is your best first move
✔️ Create your 30-day action plan to launch
✔️ Identify your fastest path to $5K-10K
✔️ Show you exactly how The Wealth Lab accelerates your timeline

*Corporate has taken enough. Let's build the life you actually deserve.*

IMPORTANT: 
- Make each idea SPECIFIC to their answers, not generic
- Reference their actual responses throughout
- The moonshot should feel ambitious but possible with guidance
- Keep the tone empowering, direct, and aspirational
- Focus on PROBLEMS they'll solve, not just products they'll create`;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      const data = await response.json();
      setBusinessIdeas(data.ideas);
      const pdfRes = await fetch('/api/generatePdf', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ businessIdeas: data.ideas })
});

const pdfBlob = await pdfRes.blob();
const pdfUrl = URL.createObjectURL(pdfBlob);

      await fetch('/api/sendToGHL', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    firstName: userInfo.fname,
    lastName: userInfo.lname,
    email: userInfo.email,
    phone: userInfo.phone,
    question1: answers.q1,
    question2: answers.q2,
    question3: answers.q3,
    question4: answers.q4,
    question5: answers.q5,
    question6: answers.q6,
    question7: answers.q7,
    businessIdeas: data.ideas
  })
});

      setStep('results');
    } catch (error) {
      console.error('Error generating ideas:', error);
      alert('Something went wrong. Please try again.');
      setStep('questions');
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    return answers.q1 && answers.q2 && answers.q3 && answers.q4 && 
           answers.q5 && answers.q6 && answers.q7.length > 0;
  };

  if (step === 'welcome') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #FDF9ED, #f5f0e0, #FDF9ED)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}>
        <style jsx global>{`
          body { margin: 0; padding: 0; }
        `}</style>
        <div style={{
          maxWidth: '672px',
          width: '100%',
          backgroundColor: '#0A1F33',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
          padding: '48px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <Sparkles style={{ width: '64px', height: '64px', color: '#C8A15A' }} />
          </div>
          <h1 style={{
            fontSize: '36px',
            color: '#FDF9ED',
            textAlign: 'center',
            marginBottom: '16px',
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 600
          }}>
            Welcome{userInfo.fname && `, ${userInfo.fname}`}!
          </h1>
          <p style={{
            fontSize: '20px',
            color: '#FDF9ED',
            textAlign: 'center',
            marginBottom: '32px',
            fontFamily: 'DM Sans, sans-serif'
          }}>
            You're about to discover 3 personalized business ideas designed specifically for you — ideas that can help you leave corporate behind and build the life you actually deserve.
          </p>
          <div style={{
            backgroundColor: 'rgba(183, 199, 179, 0.3)',
            borderLeft: '4px solid #C8A15A',
            padding: '24px',
            marginBottom: '32px'
          }}>
            <p style={{
              color: '#FDF9ED',
              fontWeight: 500,
              margin: 0,
              fontFamily: 'DM Sans, sans-serif'
            }}>
              This will take about 5-7 minutes. Answer honestly — the more specific you are, the better your personalized business ideas will be.
            </p>
          </div>
          <button
            onClick={() => setStep('questions')}
            style={{
              width: '100%',
              backgroundColor: '#C8A15A',
              color: '#FDF9ED',
              fontWeight: 600,
              padding: '16px 24px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '18px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'Montserrat, sans-serif',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#B8915A'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#C8A15A'}
          >
            Let's Get Started
            <ArrowRight style={{ marginLeft: '8px', width: '20px', height: '20px' }} />
          </button>
        </div>
      </div>
    );
  }

  if (step === 'questions') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #FDF9ED, #f5f0e0, #FDF9ED)',
        padding: '48px 24px'
      }}>
        <style jsx global>{`
          body { margin: 0; padding: 0; }
        `}</style>
        <div style={{
          maxWidth: '768px',
          margin: '0 auto',
          backgroundColor: '#0A1F33',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
          padding: '48px'
        }}>
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{
              color: '#FDF9ED',
              fontSize: '30px',
              marginBottom: '8px',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 600
            }}>
              Your Business Discovery Questionnaire
            </h2>
            <p style={{
              color: '#FDF9ED',
              opacity: 0.8,
              fontFamily: 'DM Sans, sans-serif'
            }}>
              Answer these 7 questions to unlock your personalized business ideas
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ borderBottom: '1px solid #B7C7B3', paddingBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '18px',
                fontWeight: 500,
                color: '#FDF9ED',
                marginBottom: '12px',
                fontFamily: 'DM Sans, sans-serif'
              }}>
                1. If money weren't a concern for the next 2 years, what would you spend your time doing or learning?
              </label>
              <textarea
                value={answers.q1}
                onChange={(e) => handleAnswerChange('q1', e.target.value)}
                style={{
                  width: '100%',
                  border: '2px solid #B7C7B3',
                  borderRadius: '8px',
                  padding: '16px',
                  backgroundColor: '#FDF9ED',
                  color: '#0A1F33',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '16px'
                }}
                rows="4"
                placeholder="Be specific... what lights you up?"
              />
            </div>

            <div style={{ borderBottom: '1px solid #B7C7B3', paddingBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '18px',
                fontWeight: 500,
                color: '#FDF9ED',
                marginBottom: '12px',
                fontFamily: 'DM Sans, sans-serif'
              }}>
                2. What is the biggest frustration you have with your current job, that you believe would no longer exist if you were an entrepreneur?
              </label>
              <textarea
                value={answers.q2}
                onChange={(e) => handleAnswerChange('q2', e.target.value)}
                style={{
                  width: '100%',
                  border: '2px solid #B7C7B3',
                  borderRadius: '8px',
                  padding: '16px',
                  backgroundColor: '#FDF9ED',
                  color: '#0A1F33',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '16px'
                }}
                rows="4"
                placeholder="What makes you say 'I can't do this anymore'?"
              />
            </div>

            <div style={{ borderBottom: '1px solid #B7C7B3', paddingBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '18px',
                fontWeight: 500,
                color: '#FDF9ED',
                marginBottom: '12px',
                fontFamily: 'DM Sans, sans-serif'
              }}>
                3. What is something you already do professionally that you deeply enjoy or find yourself losing track of time while doing?
              </label>
              <textarea
                value={answers.q3}
                onChange={(e) => handleAnswerChange('q3', e.target.value)}
                style={{
                  width: '100%',
                  border: '2px solid #B7C7B3',
                  borderRadius: '8px',
                  padding: '16px',
                  backgroundColor: '#FDF9ED',
                  color: '#0A1F33',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '16px'
                }}
                rows="4"
                placeholder="What work feels like play to you?"
              />
            </div>

            <div style={{ borderBottom: '1px solid #B7C7B3', paddingBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '18px',
                fontWeight: 500,
                color: '#FDF9ED',
                marginBottom: '12px',
                fontFamily: 'DM Sans, sans-serif'
              }}>
                4. What do people consistently come to you for advice, help, or recommendations about - both professionally and personally?
              </label>
              <textarea
                value={answers.q4}
                onChange={(e) => handleAnswerChange('q4', e.target.value)}
                style={{
                  width: '100%',
                  border: '2px solid #B7C7B3',
                  borderRadius: '8px',
                  padding: '16px',
                  backgroundColor: '#FDF9ED',
                  color: '#0A1F33',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '16px'
                }}
                rows="4"
                placeholder="What are you known for helping people with?"
              />
            </div>

            <div style={{ borderBottom: '1px solid #B7C7B3', paddingBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '18px',
                fontWeight: 500,
                color: '#FDF9ED',
                marginBottom: '12px',
                fontFamily: 'DM Sans, sans-serif'
              }}>
                5. How much time could you realistically dedicate to building something on the side right now?
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { value: '3-5 hours/week', label: '3-5 hours/week' },
                  { value: '6-10 hours/week', label: '6-10 hours/week' },
                  { value: '11-20 hours/week', label: '11-20 hours/week' },
                  { value: '20+ hours/week', label: '20+ hours/week' },
                  { value: 'Less than 3 hours', label: "I don't even have 3 hours/week" }
                ].map(option => (
                  <label key={option.value} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    color: '#FDF9ED',
                    fontFamily: 'DM Sans, sans-serif'
                  }}>
                    <input
                      type="radio"
                      name="q5"
                      value={option.value}
                      checked={answers.q5 === option.value}
                      onChange={(e) => handleAnswerChange('q5', e.target.value)}
                      style={{ width: '20px', height: '20px', accentColor: '#C8A15A' }}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ borderBottom: '1px solid #B7C7B3', paddingBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '18px',
                fontWeight: 500,
                color: '#FDF9ED',
                marginBottom: '12px',
                fontFamily: 'DM Sans, sans-serif'
              }}>
                6. What does success look like to you in 1-3 years? Pick the vision that resonates most.
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  '6-12 months of expenses saved, traveling internationally 2-3 times per year, and still keeping the security of my corporate role',
                  'Earning 6 figures annually from my own business while working for myself full-time with flexibility and autonomy',
                  'Building a 7-figure business working 10-20 hours per week from wherever I choose, with complete time and location freedom',
                  'Generating consistent income that covers my lifestyle while having time to pursue passions, hobbies, and relationships that matter most'
                ].map((option, idx) => (
                  <label key={idx} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    cursor: 'pointer',
                    color: '#FDF9ED',
                    fontFamily: 'DM Sans, sans-serif'
                  }}>
                    <input
                      type="radio"
                      name="q6"
                      value={option}
                      checked={answers.q6 === option}
                      onChange={(e) => handleAnswerChange('q6', e.target.value)}
                      style={{ width: '20px', height: '20px', marginTop: '4px', accentColor: '#C8A15A' }}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ paddingBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '18px',
                fontWeight: 500,
                color: '#FDF9ED',
                marginBottom: '12px',
                fontFamily: 'DM Sans, sans-serif'
              }}>
                7. What's most important to you in your next chapter? (Select all that apply)
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  'Flexible schedule/work on my own terms',
                  'Location freedom/ability to work from anywhere',
                  'Earning the same or more than I make now',
                  'Doing work that feels meaningful/aligned with my values',
                  'Being my own boss/no more micromanagement',
                  'Building generational wealth',
                  'Having more time for family/personal life'
                ].map((option, idx) => (
                  <label key={idx} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    cursor: 'pointer',
                    color: '#FDF9ED',
                    fontFamily: 'DM Sans, sans-serif'
                  }}>
                    <input
                      type="checkbox"
                      checked={answers.q7.includes(option)}
                      onChange={() => handleCheckboxChange('q7', option)}
                      style={{ width: '20px', height: '20px', marginTop: '4px', accentColor: '#C8A15A' }}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={generateIdeas}
            disabled={!canProceed()}
            style={{
              width: '100%',
              fontWeight: 600,
              padding: '16px 24px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '18px',
              marginTop: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: canProceed() ? 'pointer' : 'not-allowed',
              backgroundColor: canProceed() ? '#C8A15A' : '#ccc',
              color: canProceed() ? '#FDF9ED' : '#666',
              fontFamily: 'Montserrat, sans-serif',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => canProceed() && (e.target.style.backgroundColor = '#B8915A')}
            onMouseOut={(e) => canProceed() && (e.target.style.backgroundColor = '#C8A15A')}
          >
            <Sparkles style={{ marginRight: '8px', width: '20px', height: '20px' }} />
            Generate My Business Ideas
          </button>
        </div>
      </div>
    );
  }

  if (step === 'loading') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #FDF9ED, #f5f0e0, #FDF9ED)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}>
        <style jsx global>{`
          body { margin: 0; padding: 0; }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
        <div style={{
          maxWidth: '672px',
          width: '100%',
          backgroundColor: '#0A1F33',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
          padding: '48px',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <div style={{ animation: 'spin 1s linear infinite' }}>
              <Sparkles style={{ width: '64px', height: '64px', color: '#C8A15A' }} />
            </div>
          </div>
          <h2 style={{
            fontSize: '30px',
            color: '#FDF9ED',
            marginBottom: '16px',
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 600
          }}>
            Creating Your Personalized Business Ideas...
          </h2>
          <p style={{
            color: '#FDF9ED',
            opacity: 0.8,
            fontSize: '18px',
            marginBottom: '32px',
            fontFamily: 'DM Sans, sans-serif'
          }}>
            Our AI is analyzing your answers and crafting 3 custom business ideas just for you.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              color: '#C8A15A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'DM Sans, sans-serif'
            }}>
              <Clock style={{ width: '20px', height: '20px', marginRight: '8px' }} />
              <span>Analyzing your unique strengths...</span>
            </div>
            <div style={{
              color: '#C8A15A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'DM Sans, sans-serif'
            }}>
              <Target style={{ width: '20px', height: '20px', marginRight: '8px' }} />
              <span>Identifying market opportunities...</span>
            </div>
            <div style={{
              color: '#C8A15A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'DM Sans, sans-serif'
            }}>
              <TrendingUp style={{ width: '20px', height: '20px', marginRight: '8px' }} />
              <span>Crafting your path to freedom...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'results') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #FDF9ED, #f5f0e0, #FDF9ED)',
        padding: '48px 24px'
      }}>
        <style jsx global>{`
          body { margin: 0; padding: 0; }
        `}</style>
        <div style={{
          maxWidth: '896px',
          margin: '0 auto',
          backgroundColor: '#0A1F33',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
          padding: '48px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <Sparkles style={{ width: '64px', height: '64px', color: '#C8A15A' }} />
          </div>
          <h1 style={{
            fontSize: '36px',
            color: '#FDF9ED',
            textAlign: 'center',
            marginBottom: '16px',
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 600
          }}>
            Your Personalized Business Ideas, {userInfo.fname}!
          </h1>
          <p style={{
            fontSize: '20px',
            color: '#FDF9ED',
            opacity: 0.8,
            textAlign: 'center',
            marginBottom: '48px',
            fontFamily: 'DM Sans, sans-serif'
          }}>
            Here are 3 custom business ideas designed specifically for you based on your answers.
          </p>
          
          <div style={{
            color: '#FDF9ED',
            lineHeight: '1.8',
            whiteSpace: 'pre-wrap',
            fontFamily: 'DM Sans, sans-serif'
          }}>
            {businessIdeas.split('\n').map((line, idx) => {
              if (line.startsWith('**') && line.endsWith('**')) {
                return <h3 key={idx} style={{
                  fontSize: '20px',
                  color: '#FDF9ED',
                  marginTop: '24px',
                  marginBottom: '12px',
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 600
                }}>{line.replace(/\*\*/g, '')}</h3>;
              }
              if (line.startsWith('IDEA')) {
                return <h2 key={idx} style={{
                  fontSize: '24px',
                  color: '#C8A15A',
                  marginTop: '32px',
                  marginBottom: '16px',
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 600
                }}>{line}</h2>;
              }
              if (line.trim() === '---') {
                return <hr key={idx} style={{
                  margin: '32px 0',
                  border: 'none',
                  borderTop: '1px solid #B7C7B3'
                }} />;
              }
              if (line.startsWith('*') && line.endsWith('*')) {
                return <p key={idx} style={{
                  color: '#FDF9ED',
                  fontSize: '18px',
                  marginBottom: '16px',
                  fontFamily: 'Playfair Display, serif',
                  fontStyle: 'italic'
                }}>{line.replace(/\*/g, '')}</p>;
              }
              if (line.startsWith('✔️') || line.startsWith('-')) {
                return <p key={idx} style={{ marginLeft: '16px', marginBottom: '8px' }}>{line}</p>;
              }
              return <p key={idx} style={{ marginBottom: '16px' }}>{line}</p>;
            })}
          </div>

          <div style={{
            marginTop: '48px',
            backgroundColor: 'rgba(183, 199, 179, 0.3)',
            border: '2px solid #C8A15A',
            borderRadius: '12px',
            padding: '32px',
            textAlign: 'center'
          }}>
            <h3 style={{
              fontSize: '24px',
              color: '#FDF9ED',
              marginBottom: '16px',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 600
            }}>
              Ready to Make This Real?
            </h3>
            <p style={{
              color: '#FDF9ED',
              fontSize: '18px',
              marginBottom: '24px',
              fontFamily: 'DM Sans, sans-serif'
            }}>
              Book your free 30-minute strategy call and let's turn one of these ideas into your reality.
            </p>

            <a
              href="https://calendly.com/jsimonesolutions/business-ideas-brainstorming"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                backgroundColor: '#C8A15A',
                color: '#0A1F33',
                fontWeight: 600,
                padding: '16px 32px',
                borderRadius: '8px',
                fontSize: '18px',
                textDecoration: 'none',
                fontFamily: 'Montserrat, sans-serif',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#B8915A'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#C8A15A'}
            >
              Book Your Strategy Call Now
            </a>
          </div>
        </div>
      </div>
    );
  }

  return null;
}