import * as React from "react";
import { useState } from "react";
import { pageList } from "../../Constants";
import { auth } from "../../firebase";
import "./budgetOverview.css";

const BudgetOverview = ({
  budgetData,
  selectedBudget,
  setSelectedBudget,
  setDisplayedPage,
  setSelectedBudgetIndex,
  userData,
  selectedBudgetIndex,
  setBudgetData,
  setSelectedBudgetItem,
  setSelectedBudgetItemIndex,
}: any) => {
  const [editGoals, setEditGoals] = useState(false);
  const [editBudgetTitle, setEditBudgetTitle] = useState(false);
  const [goalData, setGoalData] = useState<any>();
  const [budgetTitle, setBudgetTitle] = useState();
  const [isUserSelectedBudgetOwner, setIsUserSelectedBudgetOwner] =
    useState(false);
  const [addCommentButton, setAddCommentButton] = useState(false);
  const [commentToBeAdded, setCommentToBeAdded] = useState();
  const [editCommentButton, setEditCommentButton] = useState(false);
  const [commentToBeEdited, setCommentToEdited] = useState();
  const [userEmailToBeAdded, setUserEmailToBeAdded] = useState();
  const [userToBeAddedAccessType, setUserToBeAddedAccessType] =
    useState("read-access");

  const selectBudget = (budgetName: string) => {
    const filterToBudget = budgetData.filter(
      (budget: any) => budget?.["budget-name"] === budgetName
    );
    const filteredBudgetIndex = budgetData.findIndex(
      (budget: any) => budget?.["budget-name"] === budgetName
    );
    setSelectedBudget(filterToBudget[0]);
    setSelectedBudgetIndex(filteredBudgetIndex);
  };
  React.useEffect(() => {
    if (selectedBudget) {
      setGoalData(selectedBudget.goal);
      setBudgetTitle(selectedBudget.budgetTitle);
      if (
        selectedBudget.users.owner === userData.email ||
        selectedBudget.users["write-access"].includes(userData.email)
      )
        setIsUserSelectedBudgetOwner(true);
    }
  }, [selectedBudget]);

  const updateBudgetTitle = async (event: any) => {
    event.preventDefault();
    const token = await auth.currentUser.getIdToken();

    const response = await fetch("http://localhost:3000/budget-name-update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: userData.email,
        budgetName: budgetData[selectedBudgetIndex]["budget-name"],
        budgetNameUpdated: budgetTitle,
      }),
    });
    if (response.status === 200) {
      const data = await response.json();
      let updatedBudget = budgetData;
      updatedBudget[selectedBudgetIndex]["budget-name"] = budgetTitle;
      setBudgetData(updatedBudget);
    }
    setEditBudgetTitle(false);
  };

  const updateGoals = async (event: any) => {
    event.preventDefault();
    const token = await auth.currentUser.getIdToken();
    let updatedBudget = budgetData;
    updatedBudget[selectedBudgetIndex].goal = { ...goalData };

    const response = await fetch("http://localhost:3000/edit-goal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: userData.email,
        budgetDataToUpdate: updatedBudget[selectedBudgetIndex],
        budgetName: selectedBudget["budget-name"],
      }),
    });
    if (response.status === 200) {
      const data = await response.json();
      setBudgetData(data.budgetData);
    }

    setEditGoals(false);
  };

  const addComment = async (event: any) => {
    event.preventDefault();
    const token = await auth.currentUser.getIdToken();
    let updatedBudget = budgetData;
    if (updatedBudget[selectedBudgetIndex].comments) {
      updatedBudget[selectedBudgetIndex].comments = [
        ...updatedBudget[selectedBudgetIndex].comments,
        { user: userData.email, comment: commentToBeAdded },
      ];
    } else
      updatedBudget[selectedBudgetIndex].comments = [
        { user: userData.email, comment: commentToBeAdded },
      ];

    const response = await fetch("http://localhost:3000/add-comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: userData.email,
        budgetDataToUpdate: updatedBudget[selectedBudgetIndex],
        budgetName: selectedBudget["budget-name"],
      }),
    });
    if (response.status === 200) {
      const data = await response.json();
      setBudgetData(data.budgetData);
      setAddCommentButton(false);
    }
  };

  const addUser = async () => {
    event.preventDefault();
    const token = await auth.currentUser.getIdToken();
    let updatedBudget = budgetData;
    updatedBudget[selectedBudgetIndex].users[userToBeAddedAccessType] = [
      ...updatedBudget[selectedBudgetIndex].users[userToBeAddedAccessType],
      userEmailToBeAdded,
    ];

    const response = await fetch("http://localhost:3000/add-user-budget", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: userData.email,
        budgetDataToUpdate: updatedBudget[selectedBudgetIndex],
        budgetName: selectedBudget["budget-name"],
      }),
    });
    if (response.status === 200) {
      const data = await response.json();
      setBudgetData(data.budgetData);
      setAddCommentButton(false);
    }
  };

  const editComment = async (event: any, commentIndexToUpdate: number) => {
    event.preventDefault();
    const token = await auth.currentUser.getIdToken();
    let updatedBudget = budgetData;
    updatedBudget[selectedBudgetIndex].comments[commentIndexToUpdate] = {
      user: updatedBudget[selectedBudgetIndex].comments[commentIndexToUpdate]
        .user,
      comment: commentToBeEdited,
    };

    const response = await fetch("http://localhost:3000/edit-comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: userData.email,
        budgetName: selectedBudget["budget-name"],
        budgetDataToUpdate: updatedBudget[selectedBudgetIndex],
      }),
    });
    if (response.status === 200) {
      const data = await response.json();
      setBudgetData(data.budgetData);
      setEditCommentButton(false);
    }
  };

  const deleteComment = async (indexToBeDeleted: number) => {
    event.preventDefault();
    const token = await auth.currentUser.getIdToken();
    let updatedBudget = budgetData;
    updatedBudget[selectedBudgetIndex].comments = updatedBudget[
      selectedBudgetIndex
    ].comments.filter((_: any, index: any) => indexToBeDeleted !== index);

    const response = await fetch("http://localhost:3000/delete-comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: userData.email,
        budgetName: selectedBudget["budget-name"],
        budgetDataToUpdate: updatedBudget[selectedBudgetIndex],
      }),
    });
    if (response.status === 200) {
      const data = await response.json();
      setBudgetData(data.budgetData);
    }
  };

  const deleteBudget = async (event: any) => {
    event.preventDefault();
    const token = await auth.currentUser.getIdToken();
    const response = await fetch("http://localhost:3000/delete-budget", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: userData.email,
        budgetName: selectedBudget["budget-name"],
      }),
    });
    if (response.status === 200) {
      const data = await response.json();
      setBudgetData(data.budgetData);
      setSelectedBudget();
      setSelectedBudgetIndex();
    }
  };

  const removeUserBudget = async(event:any, accessType:any, userIndex:any) =>{
    event.preventDefault();
    const token = await auth.currentUser.getIdToken();

    let updatedBudget = budgetData;
    updatedBudget[selectedBudgetIndex].users[accessType] = [...updatedBudget[selectedBudgetIndex].users[accessType].filter((_:any,index:any)=> userIndex !== index)]
    const response = await fetch("http://localhost:3000/remove-user-budget", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: userData.email,
          budgetName: selectedBudget["budget-name"],
          budgetDataToUpdate: updatedBudget[selectedBudgetIndex]
        }),
      });
      if (response.status === 200) {
        const data = await response.json();
        setBudgetData(data.budgetData);
      }
  }

  return (
    <div className="budget-container">
      {budgetData?.map((budget: any, index: number) => {
        return (
          <div key={index}>
            <button
              onClick={() => {
                selectBudget(budget?.["budget-name"]);
              }}
            >
              <p>{budget?.["budget-name"]}</p>
            </button>
          </div>
        );
      })}
      {selectedBudget && (
        <div>
          {isUserSelectedBudgetOwner && editBudgetTitle ? (
            <form>
              <input
                value={budgetTitle}
                onChange={(event: any) => {
                  setBudgetTitle(event.target.value);
                }}
              />
              <input onClick={updateBudgetTitle} type="submit" />
            </form>
          ) : (
            <>
              <h3>{selectedBudget?.["budget-name"]} </h3>
              {isUserSelectedBudgetOwner && (
                <button
                  onClick={() => {
                    setEditBudgetTitle(true);
                  }}
                >
                  edit budget title
                </button>
              )}
            </>
          )}
          <button onClick={deleteBudget}>delete budget</button>

          {editGoals && goalData ? (
            <form>
              <input
                value={goalData["daily-budget"]}
                onChange={(event: any) => {
                  setGoalData({
                    ...goalData,
                    "daily-budget": Number(event.target.value),
                  });
                }}
              />
              <input
                value={goalData["weekly-budget"]}
                onChange={(event: any) => {
                  setGoalData({
                    ...goalData,
                    "weekly-budget": Number(event.target.value),
                  });
                }}
              />
              <input
                value={goalData["monthly-budget"]}
                onChange={(event: any) => {
                  setGoalData({
                    ...goalData,
                    "monthly-budget": Number(event.target.value),
                  });
                }}
              />
              <input
                value={goalData["yearly-budget"]}
                onChange={(event: any) => {
                  setGoalData({
                    ...goalData,
                    "yearly-budget": Number(event.target.value),
                  });
                }}
              />
              <input onClick={updateGoals} type="submit" />
            </form>
          ) : (
            <>
              <ul>
                <li>daily goal: {selectedBudget?.goal?.["daily-budget"]}</li>
                <li>weekly goal: {selectedBudget?.goal?.["weekly-budget"]}</li>
                <li>
                  monthly goal: {selectedBudget?.goal?.["monthly-budget"]}
                </li>
                <li>yearly goal: {selectedBudget?.goal?.["yearly-budget"]}</li>
              </ul>
              {isUserSelectedBudgetOwner && (
                <button
                  onClick={() => {
                    setEditGoals(true);
                  }}
                >
                  edit goals
                </button>
              )}
            </>
          )}

          {selectedBudget?.["budget-item-totals"] && (
            <ul>
              <li>
                daily budget total:{" "}
                {selectedBudget?.goal?.["budget-item-daily-total"]}
              </li>
              <li>
                weekly budget total:{" "}
                {selectedBudget?.goal?.["budget-item-weekly-total"]}
              </li>
              <li>
                monthly budget total:{" "}
                {selectedBudget?.goal?.["budget-item-monthly-total"]}
              </li>
              <li>
                yearly budget total:{" "}
                {selectedBudget?.goal?.["budget-item-yearly-total"]}
              </li>
            </ul>
          )}
          {selectedBudget?.budgets &&
            selectedBudget?.budgets?.map((budgetItem: any, index: number) => {
              return (
                <div key={index}>
                  <p>{budgetItem?.date}</p>
                  {budgetItem?.budget?.map((item: any, index: number) => {
                    return (
                      <>
                        <ul key={index}>
                          <li>{item?.budgetItemAmount}</li>
                          <li>{item?.budgetItemName}</li>
                          <li>{item?.budgetItemType}</li>
                        </ul>
                      </>
                    );
                  })}
                </div>
              );
            })}
          {isUserSelectedBudgetOwner && (
            <button onClick={() => setDisplayedPage(pageList.addFinancePage)}>
              add/edit/delete budget items
            </button>
          )}
          {isUserSelectedBudgetOwner &&
            selectedBudget?.comments &&
            selectedBudget?.comments.map(
              (commentObject: any, index: number) => {
                const { comment, user } = commentObject;
                return editCommentButton ? (
                  <form key={index}>
                    <p>user: {user}</p>
                    <input
                      value={commentToBeEdited}
                      onChange={(event: any) =>
                        setCommentToEdited(event.target.value)
                      }
                    />
                    <button
                      onClick={() => {
                        setEditCommentButton(false);
                      }}
                    >
                      cancel comment edit
                    </button>
                    <input
                      type="submit"
                      onClick={(event: any) => editComment(event, index)}
                    />
                  </form>
                ) : (
                  <span key={index}>
                    <p>{user}: </p> <p>{comment}</p>{" "}
                    <button onClick={() => setEditCommentButton(true)}>
                      edit comment
                    </button>{" "}
                    <button onClick={() => deleteComment(index)}>
                      delete comment
                    </button>
                  </span>
                );
              }
            )}
          {isUserSelectedBudgetOwner &&
            (addCommentButton ? (
              <form>
                <textarea
                  onChange={(event: any) => {
                    setCommentToBeAdded(event.target.value);
                  }}
                />
                <button onClick={() => setAddCommentButton(false)}>
                  cancel
                </button>
                <input onClick={addComment} type="submit" />
              </form>
            ) : (
              <button onClick={() => setAddCommentButton(true)}>
                add comment
              </button>
            ))}

          {selectedBudget?.users && (
            <>
                {selectedBudget?.users['write-access'].length > 0 && <p>write-access</p>}
                {selectedBudget?.users['write-access'].length > 0 && (
                    selectedBudget?.users['write-access'].map((thisUser:any, index:number)=>
                        <span><li>{thisUser}</li> { isUserSelectedBudgetOwner && <button onClick={(event:any)=>removeUserBudget(event,'write-access', index)}>remove user</button>}</span>
                    )
                )}
                {selectedBudget?.users['read-access'].length > 0 && <p>read-access</p>}
                {selectedBudget?.users['read-access'].length > 0 && (
                    selectedBudget?.users['read-access'].map((thisUser:any, index:number)=>
                        <span><li>{thisUser}</li> { isUserSelectedBudgetOwner && <button onClick={(event:any)=>removeUserBudget(event,'read-access', index)}>remove user</button>}</span>
                    )
                )}
            </>
          )}
          {isUserSelectedBudgetOwner && (
            <>
              <p>add user</p>
              <form>
                <label>user email</label>
                <input
                  onChange={(event: any) =>
                    setUserEmailToBeAdded(event.target.value)
                  }
                  type="text"
                />
                <select
                  onChange={(event: any) =>
                    setUserToBeAddedAccessType(event.target.value)
                  }
                >
                  <option value="read-access">read-access</option>
                  <option value="write-access">write-access</option>
                </select>
                <input onClick={addUser} type="submit" />
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default BudgetOverview;
