import React from 'react';
import { Button } from '../stories/Button';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className='text-center' style={{
            position: "absolute",
            top: '50%',
            left: '50%',
            transform: ' translate(-50%, -50%)',
            padding: '10px'
        }}>
            <h1>Welcome!</h1>
            <div className='d-flex'>
                <Link
                    to={'/teacher'}>
                    <Button
                        label='Log in'
                        size='large'
                        type="submit"
                        style={{ borderRadius: '0', marginRight: '2rem' }}
                        btnClass={
                            'primary'
                        }
                    />
                </Link>
                <Link
                    to={'/registration'}>
                    <Button
                        label='Register'
                        size='large'
                        type="submit"
                        style={{ borderRadius: '0', marginLeft: '2rem' }}
                        btnClass={
                            'primary'
                        }
                    />
                </Link>
            </div>
        </div>

    );
};

export default Home;
