const CouponManager = ({ coupons }) => {
    return (
        <div className="admin-section animate-fadeIn">
            <h1>Coupons ({coupons.length})</h1>
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Value</th>
                            <th>Used</th>
                            <th>Expires</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coupons.map(c => (
                            <tr key={c._id}>
                                <td className="coupon-code">{c.code}</td>
                                <td>{c.discountType === 'percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`}</td>
                                <td>{c.usedCount}</td>
                                <td>{new Date(c.expiresAt).toLocaleDateString()}</td>
                                <td><span className={`badge ${c.isActive ? 'badge-success' : 'badge-error'}`}>{c.isActive ? 'Active' : 'Inactive'}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CouponManager;
