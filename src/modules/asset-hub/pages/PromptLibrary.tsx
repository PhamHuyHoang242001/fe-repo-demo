import React from 'react';
import PromptWorkspace from './prompt/PromptWorkspace';

// Prompt Library entry (route /asset-hub/prompt). The workspace shell (3-tab: Published /
// My Prompts / Review Queue) lives in ./prompt/PromptWorkspace, mirroring the Skill Package shell.
const PromptLibrary: React.FC = () => <PromptWorkspace />;

export default PromptLibrary;
