/**
 * Shared styles for Light Sync Master frontend
 */

import { css } from 'lit';

export const commonStyles = css`
  :host {
    --primary-color: var(--primary-color);
    --accent-color: var(--accent-color);
    --primary-text-color: var(--primary-text-color);
    --secondary-text-color: var(--secondary-text-color);
    --disabled-text-color: var(--disabled-text-color);
    --divider-color: var(--divider-color);
    --card-background-color: var(--card-background-color);
    --primary-background-color: var(--primary-background-color);
    --secondary-background-color: var(--secondary-background-color);
    --state-icon-color: var(--state-icon-color);
    --state-icon-active-color: var(--state-icon-active-color);

    --ha-card-border-radius: 12px;
    --mdc-theme-primary: var(--primary-color);
    --mdc-theme-secondary: var(--accent-color);
  }

  * {
    box-sizing: border-box;
  }

  .card {
    background: var(--card-background-color);
    border-radius: var(--ha-card-border-radius);
    padding: 16px;
    margin: 8px 0;
    box-shadow: var(--ha-card-box-shadow, 0 2px 4px rgba(0,0,0,0.1));
  }

  .section {
    margin: 16px 0;
  }

  .section-title {
    font-size: 18px;
    font-weight: 500;
    color: var(--primary-text-color);
    margin: 0 0 12px 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .section-title ha-icon {
    color: var(--primary-color);
  }

  .row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 0;
  }

  .row.space-between {
    justify-content: space-between;
  }

  .col {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .grid {
    display: grid;
    gap: 16px;
  }

  .grid-2 {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }

  .grid-3 {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  .grid-4 {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }

  /* Buttons */
  .button {
    padding: 8px 16px;
    border: none;
    border-radius: 8px;
    background: var(--primary-color);
    color: white;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  .button:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  .button:active {
    transform: translateY(0);
  }

  .button.secondary {
    background: var(--secondary-background-color);
    color: var(--primary-text-color);
  }

  .button.danger {
    background: var(--error-color, #f44336);
  }

  .button.small {
    padding: 4px 12px;
    font-size: 12px;
  }

  .icon-button {
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 50%;
    background: var(--secondary-background-color);
    color: var(--primary-text-color);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }

  .icon-button:hover {
    background: var(--divider-color);
  }

  /* Stats */
  .stat-card {
    background: var(--card-background-color);
    border-radius: var(--ha-card-border-radius);
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    box-shadow: var(--ha-card-box-shadow, 0 2px 4px rgba(0,0,0,0.1));
  }

  .stat-value {
    font-size: 32px;
    font-weight: 600;
    color: var(--primary-text-color);
    line-height: 1;
  }

  .stat-label {
    font-size: 14px;
    color: var(--secondary-text-color);
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--primary-color);
    color: white;
  }

  /* Badges */
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 12px;
    border-radius: 16px;
    font-size: 12px;
    font-weight: 500;
    background: var(--secondary-background-color);
    color: var(--primary-text-color);
  }

  .badge.success {
    background: rgba(76, 175, 80, 0.2);
    color: #4caf50;
  }

  .badge.error {
    background: rgba(244, 67, 54, 0.2);
    color: #f44336;
  }

  .badge.warning {
    background: rgba(255, 152, 0, 0.2);
    color: #ff9800;
  }

  .badge.info {
    background: rgba(33, 150, 243, 0.2);
    color: #2196f3;
  }

  /* Toggle Switch */
  .toggle-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background: var(--card-background-color);
    border-radius: 8px;
  }

  /* List Items */
  .list-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: var(--card-background-color);
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .list-item:hover {
    background: var(--secondary-background-color);
  }

  .list-item-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--secondary-background-color);
  }

  .list-item-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .list-item-title {
    font-size: 14px;
    font-weight: 500;
    color: var(--primary-text-color);
  }

  .list-item-subtitle {
    font-size: 12px;
    color: var(--secondary-text-color);
  }

  /* Color Preview */
  .color-preview {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid var(--divider-color);
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .color-preview.large {
    width: 64px;
    height: 64px;
  }

  /* Loading */
  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 32px;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid var(--divider-color);
    border-top-color: var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Empty State */
  .empty-state {
    text-align: center;
    padding: 48px 16px;
    color: var(--secondary-text-color);
  }

  .empty-state ha-icon {
    font-size: 64px;
    color: var(--disabled-text-color);
    margin-bottom: 16px;
  }

  /* Divider */
  .divider {
    height: 1px;
    background: var(--divider-color);
    margin: 16px 0;
  }

  /* Scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: var(--secondary-background-color);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: var(--divider-color);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--secondary-text-color);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .grid-2,
    .grid-3,
    .grid-4 {
      grid-template-columns: 1fr;
    }

    .card {
      margin: 4px 0;
      padding: 12px;
    }
  }
`;
