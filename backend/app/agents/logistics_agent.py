from typing import List, Optional


def calculate_utilization(current_stock: float, capacity: float) -> float:
    if capacity <= 0:
        return 0.0
    return round((current_stock / capacity) * 100, 2)


def analyze_inventory_trend(stock_history: List[float]) -> dict:
    if not stock_history:
        return {"trend": "unknown", "days_of_supply_remaining": None, "avg_daily_change": 0}
    changes = [stock_history[i] - stock_history[i - 1] for i in range(1, len(stock_history))]
    avg_daily_change = sum(changes) / len(changes) if changes else 0
    if avg_daily_change > 0:
        trend = "increasing"
        days_remaining = None
    elif avg_daily_change < 0:
        trend = "decreasing"
        latest = stock_history[-1]
        daily_consumption = abs(avg_daily_change)
        days_remaining = round(latest / daily_consumption, 1) if daily_consumption > 0 else None
    else:
        trend = "stable"
        days_remaining = None
    return {
        "trend": trend,
        "days_of_supply_remaining": days_remaining,
        "avg_daily_change": round(avg_daily_change, 2),
    }


def detect_supply_risk(utilization: float, shipments_in_transit: int = 0, eta_delays: int = 0) -> dict:
    risk_level = "low"
    risk_factors = []
    if utilization >= 90:
        risk_level = "critical"
        risk_factors.append("Storage near capacity")
    elif utilization >= 75:
        risk_level = "high"
        risk_factors.append("Storage utilization elevated")
    if shipments_in_transit == 0 and utilization > 50:
        if risk_level == "low":
            risk_level = "medium"
        risk_factors.append("No shipments in transit to replenish")
    if eta_delays > 0:
        risk_level = "high" if risk_level != "critical" else "critical"
        risk_factors.append(f"{eta_delays} shipment(s) delayed")
    return {
        "risk_level": risk_level,
        "risk_factors": risk_factors,
        "utilization_pct": utilization,
    }


def generate_logistics_report(terminal_name: str, findings: dict) -> str:
    report = f"=== Logistics Report: {terminal_name} ===\n"
    for key, value in findings.items():
        report += f"{key}: {value}\n"
    report += "=" * (len(terminal_name) + 24)
    return report
