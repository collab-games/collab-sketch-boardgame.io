import React from 'react';
import './Quote.css';

const Quote = (props) => {
  return (
    <div className="quote">
      <div className="testimonial-quote group right">
        <div className="quote-container">
          <div>
            <blockquote>
              <p>{props.text}”</p>
            </blockquote>
            <cite><span>{props.author}</span>
            </cite>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quote;