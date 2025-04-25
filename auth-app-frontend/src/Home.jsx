import React, { useEffect, useState } from 'react'
import "./Index.css"
import { useRef} from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
    const navigate = useNavigate()
    const [count,setCount] = useState(0)
    const [showModal, setShowModal] = useState(false)
    const [onBoardingForm,setOnBoardingForm] = useState({
        role: "",
        work: {
            design: false,
            development: false,
            writing: false,
            marketing: false,
            other: false,
        },
        work_other: "",
        country: "",
        tools: [],
        goals : {
            Subscription_costs : false,
            Tool_usage_engagement : false,
            Unused_duplicate_tools : false,
            Personalized_tool_suggestions : false,

        }
    })
    const progressBar = useRef(null)
    const token = sessionStorage.getItem("token")

    const {role,work,work_other,country,goals,tools} = onBoardingForm

    const handleChange = (e) =>{
        const {name,value,checked} = e.target
        if(name === "work"){
            setOnBoardingForm((prevState) => ({
                ...prevState,
                work : {
                    ...prevState.work,
                    [value]: checked
                }
            }))
        }else if(name === "goals"){
            // const value = e.target.value.replace(/ /g, "_")
            setOnBoardingForm((prevState) => ({
                ...prevState,
                goals : {
                    ...prevState.goals,
                    [value]: checked
                }
            }))
        }else{
            setOnBoardingForm((prevState) => ({
                ...prevState,
                [name]: value
            }))
        }
    }
    const handleToolsChange= (tool) =>{
        setOnBoardingForm((prevState)=>{
            const tools = prevState.tools.includes(tool) ? prevState.tools.filter(t => t !== tool) : [...prevState.tools, tool]
            return {
                ...onBoardingForm,
                tools: tools
            }
        })

    }

    const openModal = () =>{
        setShowModal(true)
    }

    const closeModal = () =>{
        setShowModal(false)
    }
    const nextStep = () => {
        
        setCount((prevCount) => {
            if(prevCount === 1){
                if(!role || !Object.values(work).includes(true)){
                    return prevCount
                }
            }else if(prevCount === 2){
                if(!country){
                    return prevCount
                }
            }else if(prevCount === 3){
                console.log(tools)
                if(tools.length == 0 ){
                    return prevCount
                }
            }
            else if(prevCount === 4){
                if(!Object.values(goals).includes(true)){
                    return prevCount
                }
            }
            return prevCount + 1
        })
    }
    const skipStep = (param) => {
        setOnBoardingForm((prevState) => ({
            ...prevState,
            [param]:  param == "tools" ? [] : ""
        }))
        setCount((prevCount) => prevCount + 1)
    } 

    useEffect(()=>{
        if(!token) {
            return navigate("/login")
        }
    },[])

    useEffect(() => {
        const progress = ((count+1) / 6) * 100;
        if (progressBar.current) {
            progressBar.current.style.width = `${progress}%`;
        }  
    },[count])

  return (
        <div className='on-boardingcontainer'>
            <div className="progress-bar">
                <div ref={progressBar} className="progress" id="progress"></div>
            </div>
            <div className={`${count == 0 ? 'step active' : 'step'}`} id="step0">
                <div className="welcome-content">
                    <h1>Welcome to Flowva</h1>
                    <p>Your smart library for organizing tools, tracking usage, and turning productivity into rewards. Let's set up your digital library in 2 minutes.</p>
                </div>
                <div className="btn-group">
                    <button className="btn2" onClick={nextStep}>Let's Go</button>
                </div>
            </div>
            <div className={`${count === 1 ? "step active" : "step"}`} id="step1">
                <h2>About You</h2>
                <p>Help us tailor your library by telling us a bit about yourself.</p>
            
                <div className="form-group">
                    <label>What best describes you? <span className="warning" id="role-warning">Please select an option</span></label>
                    <div className="radio-group">
                        <label className="radio-item">
                            <input 
                                type="radio" 
                                name="role" 
                                value="Freelancer"
                                checked={role === "Freelancer"} 
                                onChange={handleChange}
                                // required 
                            /> Freelancer
                        </label>
                        <label className="radio-item">
                            <input 
                                type="radio" 
                                name="role" 
                                value="Solo entrepreneur" 
                                checked={role === "Solo entrepreneur"} 
                                onChange={handleChange}
                            /> Solo entrepreneur
                        </label>
                        <label className="radio-item">
                            <input 
                                type="radio" 
                                name="role" 
                                value="Small team" 
                                checked={role === "Small team"}
                                onChange={handleChange}
                            /> Small team
                        </label>
                        <label className="radio-item">
                            <input 
                                type="radio" 
                                name="role" 
                                value="Creator" 
                                checked={role === "Creator"} 
                                onChange={handleChange}
                            /> Creator
                        </label>
                    </div>
                </div>
            
                <div className="form-group">
                    <label>What kind of work do you do? <span className="warning" id="work-warning">Please select at least one option</span></label>
                    <div className="checkbox-group">
                        <label className="checkbox-item">
                            <input 
                                type="checkbox" 
                                name="work" 
                                value="design"
                                checked={work.design}
                                onChange={handleChange} 
                            /> Design
                        </label>
                        <label className="checkbox-item">
                            <input 
                                type="checkbox" 
                                name="work" 
                                value="development" 
                                checked={work.development}
                                onChange={handleChange}
                                /> Development
                        </label>
                        <label className="checkbox-item">
                            <input 
                                type="checkbox" 
                                name="work" 
                                value="writing" 
                                checked={work.writing}
                                onChange={handleChange}
                                /> Writing
                        </label>
                        <label className="checkbox-item">
                            <input 
                                type="checkbox" 
                                name="work" 
                                value="marketing" 
                                checked={work.marketing}
                                onChange={handleChange}
                                /> Marketing
                        </label>
                        <label className="checkbox-item">
                            <input 
                                type="checkbox" 
                                name="work" 
                                value="other" 
                                checked={work.other}
                                onChange={handleChange}    
                            /> Other
                            <input 
                                type="text" 
                                name="work_other" 
                                className={!work.other && "hidden"} 
                                placeholder="Please specify"
                                value={work_other}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                </div>
            
                <div className="btn-group">
                    <button className="btn2" onClick={nextStep}>Continue</button>
                </div>
            </div>
             <div className={`${count === 2 ? "step active" : "step"}`} id="step2">
                <h2>Where Are You Based?</h2>
                <p>This helps us personalize tool suggestions, currencies, and rewards for you.</p>
            
                <div className="form-group">
                    <label htmlFor="country">Country</label>
                    <select vlaue={country} onChange={handleChange} id="country" name="country">
                        <option value="">Select your country</option>
                        <option value="US">United States</option>
                        <option value="GB">United Kingdom</option>
                        <option value="CA">Canada</option>
                        <option value="AU">Australia</option>
                        <option value="IN">India</option>
                        <option value="DE">Germany</option>
                        <option value="FR">France</option>
                        <option value="JP">Japan</option>
                        <option value="BR">Brazil</option>
                        <option value="NG">Nigeria</option>
                    </select>
                </div>
            
                <div className="btn-group">
                    <button className="btn2" onClick={nextStep}>Continue</button>
                    <button className="btn-skip" onClick={()=>skipStep("country")}>Skip this step</button>
                </div>
            </div>
            <div className={`${count === 3 ? "step active" : "step"}`} id="step3">
                <h2>Your Tool Stack</h2>
                <p>Which tools are part of your workflow? We'll pre-load and organize them in your library.</p>
            
                <div className="tool-grid">
                    <div onClick={()=>handleToolsChange("Notion")} className={`${onBoardingForm.tools.includes("Notion")? "tool-item selected" : "tool-item" }`} data-tool="Notion">
                        <span className="icon">📝</span>
                        <span>Notion</span>
                    </div>
                    <div onClick={()=>handleToolsChange("Trello")} className={`${onBoardingForm.tools.includes("Trello")? "tool-item selected" : "tool-item" }`} data-tool="Trello">
                        <span className="icon">📋</span>
                        <span>Trello</span>
                    </div>
                    <div onClick={()=>handleToolsChange("Slack")} className={`${onBoardingForm.tools.includes("Slack")? "tool-item selected" : "tool-item" }`} data-tool="Slack">
                        <span className="icon">💬</span>
                        <span>Slack</span>
                    </div>
                    <div onClick={()=>handleToolsChange("ClickUp")} className={`${onBoardingForm.tools.includes("ClickUp")? "tool-item selected" : "tool-item" }`} data-tool="ClickUp">
                        <span className="icon">✅</span>
                        <span>ClickUp</span>
                    </div>
                    <div onClick={()=>handleToolsChange("Canva")} className={`${onBoardingForm.tools.includes("Canva")? "tool-item selected" : "tool-item" }`} data-tool="Canva">
                        <span className="icon">🎨</span>
                        <span>Canva</span>
                    </div>
                    <div onClick={()=>handleToolsChange("Zapier")} className={`${onBoardingForm.tools.includes("Zapier")? "tool-item selected" : "tool-item" }`} data-tool="Zapier">
                        <span className="icon">⚡</span>
                        <span>Zapier</span>
                    </div>
                    <div onClick={()=>handleToolsChange("Stripe")} className={`${onBoardingForm.tools.includes("Stripe")? "tool-item selected" : "tool-item" }`}  data-tool="Stripe">
                        <span className="icon">💳</span>
                        <span>Stripe</span>
                    </div>
                    <div onClick={()=>handleToolsChange("Figma")} className={`${onBoardingForm.tools.includes("Figma")? "tool-item selected" : "tool-item" }`} data-tool="Figma">
                        <span className="icon">✏️</span>
                        <span>Figma</span>
                    </div>
                    <div onClick={()=>handleToolsChange("Calendly")} className={`${onBoardingForm.tools.includes("Calendly") ? "tool-item selected" : "tool-item" }`} data-tool="Calendly">
                        <span className="icon">📅</span>
                        <span>Calendly</span>
                    </div>
                </div>
            
                <p style={{fontSize: "0.9rem",color:"#666"}}>You can always add more tools later in your library settings.</p>
            
                <div className="btn-group">
                    <button className="btn2" onClick={nextStep}>Continue</button>
                    <button className="btn-skip" onClick={()=>skipStep("tools")}>Skip - I'll add them later</button>
                </div>
            </div>
            <div className={`${count === 4 ? "step active" : "step"}`} id="step4">
                <h2>What Do You Want to Track or Improve?</h2>
                <p>This helps us personalize your dashboard and features.</p>
            
                <div className="form-group">
                    <label>Select your goals <span className="warning" id="goals-warning">Please select at least one option</span></label>
                    <div className="checkbox-group">
                        <label className="checkbox-item">
                            <input 
                                type="checkbox" 
                                name="goals" 
                                value="Subscription_costs"  
                                checked={goals.Subscription_costs} 
                                onChange={handleChange}
                                /> Subscription costs
                        </label>
                        <label className="checkbox-item">
                            <input 
                                type="checkbox" 
                                name="goals" 
                                value="Tool_usage_engagement" 
                                checked={goals.Tool_usage_engagement}
                                onChange={handleChange}
                                /> Tool usage & engagement
                        </label>
                        <label className="checkbox-item">
                            <input 
                                type="checkbox" 
                                name="goals" 
                                value="Unused_duplicate_tools" 
                                checked={goals.Unused_duplicate_tools}
                                onChange={handleChange}
                                /> Unused/duplicate tools
                        </label>
                        <label className="checkbox-item">
                            <input 
                                type="checkbox" 
                                name="goals" 
                                value="Personalized_tool_suggestions" 
                                checked={goals.Personalized_tool_suggestions}
                                onChange={handleChange}
                                /> Personalized tool suggestions
                        </label>
                    </div>
                </div>
            
                <div className="btn-group">
                    {/* <button className="btn" onclick="validateStep4()">Continue</button> */}
                    <button className="btn2" onClick={nextStep}>Continue</button>
                </div>
            </div>

            <div className={`${count === 5 ? "step active" : "step"}`} id="step5">
                <h2>Setup Complete!</h2>
                <p>Your Flowva library is ready to use. We'll take you to your dashboard now where you can start organizing your tools and tracking your productivity.</p>
            
                <div className="btn-group">
                    <button className="btn2" onClick={openModal}>Go to Dashboard</button>
                </div>
            </div>
            <div className={`${showModal && count >=5 ? "overlay active" :  "overlay" }`} id="overlay"></div>
            <div className={`${showModal && count >=5 ? 'completion-popup active' : "completion-popup"}`} id="completionPopup">
                <h2>Onboarding Complete!</h2>
                <p>Taking you to your dashboard now.</p>
                <button className="btn2" onClick={closeModal}>OK</button>
            </div>
        </div>
    )
}
