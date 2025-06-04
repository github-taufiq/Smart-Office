package com.lift.conf.system.attendencebookingsystem.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;

public class UserPrincipal implements UserDetails {
    private String userId;
    private String username;
    private Collection<? extends GrantedAuthority> authorities;

    public UserPrincipal(String userId, String username, Collection<? extends GrantedAuthority> authorities) {
        this.userId = userId;
        this.username = username;
        this.authorities = authorities;
    }

    public String getUserId() {
        return userId;
    }

    public String getActualUserId() {
        return userId;
    }

    public String getUsernameForRecord() {
        return username;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return null;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}