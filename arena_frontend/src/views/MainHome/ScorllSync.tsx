import { useEffect, useRef, useState } from 'react';

function ScrollSyncLayout() {
    const leftRef = useRef<any>(null);
    const rightRef = useRef<any>(null);
    const [isFixed, setIsFixed] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            if (leftRef.current && rightRef.current) {
                const leftRect = leftRef.current.getBoundingClientRect();
                const rightRect = rightRef.current.getBoundingClientRect();

                // When the bottom of the right component reaches the viewport's bottom
                if (rightRect.bottom <= window.innerHeight) {
                    setIsFixed(false); // Stop "sticking" the left component
                } else if (rightRect.top <= 0) {
                    setIsFixed(true); // Stick the left component
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div style={{ position: 'relative', display: 'flex', padding: '20px' }}>
            {/* Left Component */}
            <div
                ref={leftRef}
                style={{
                    position: isFixed ? 'sticky' : 'absolute',
                    top: isFixed ? '20px' : 'auto',
                    width: '300px',
                    height: 'fit-content',
                    backgroundColor: '#ddd',
                    marginRight: '20px',
                }}
            >
                Left Component (Sticky until the right component finishes scrolling)
            </div>

            {/* Right Component */}
            <div
                ref={rightRef}
                style={{
                    width: '500px',
                    height: '2000px', // Make the right component scrollable
                    backgroundColor: '#f0f0f0',
                    padding: '20px',
                }}
            >
                Right Component
                <p>Scroll down to see the left component stop sticking.</p>
                {/* Add more content to demonstrate the scroll */}
                <div style={{ height: '1500px' }}>
                    Content in the right component that causes scrolling.
                </div>
            </div>
        </div>
    );
}

export default ScrollSyncLayout;
